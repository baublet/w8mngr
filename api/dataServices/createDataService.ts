import { Knex } from "knex";
import omit from "lodash.omit";
import { ulid } from "ulid";

import { assertIsError } from "../../shared";
import { ReturnTypeWithErrors, SomeRequired } from "../../shared/types";
import { log } from "../config/log";
import type { Context } from "../createContext";
import { algoliaService, buildConnectionResolver, errors } from "../helpers";

type PartiallyMaybe<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] | undefined;
};

type PartiallyMaybeWithNull<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] | undefined | null;
};

type QueryFactoryFunction = (
  context: Context
) => Promise<() => Knex.QueryBuilder<any, any>>;

type WhereFunctionFromQueryFactory<T extends QueryFactoryFunction> = (
  q: QueryBuilderFromFactory<T>
) => void;

type QueryBuilderFromFactory<T extends QueryFactoryFunction> = T extends (
  context: Context
) => Promise<() => infer TQueryBuilder>
  ? TQueryBuilder
  : never;

type EntityFromQueryFactoryFunction<T extends QueryFactoryFunction> =
  T extends (
    context: Context
  ) => Promise<() => Knex.QueryBuilder<infer TEntity, any>>
    ? TEntity
    : unknown;

export function createDataService<T extends QueryFactoryFunction>(
  queryFactory: T,
  entityName: string
) {
  return {
    create: getCreate(queryFactory, entityName),
    deleteBy: getDeleteBy(queryFactory),
    deleteByIds: getDeleteByIds(queryFactory),
    findBy: getFindBy(queryFactory),
    findOneBy: getFindOneBy(queryFactory),
    findOneOrFail: getFindOneOrFail(queryFactory, entityName),
    getConnection: getConnection(queryFactory),
    update: getUpdate(queryFactory),
    upsert: getUpsert(queryFactory, entityName),
    upsertBy: getUpsertBy(queryFactory, entityName),
    upsertRecordsToAlgolia: getUpsertRecordsToAlgolia(queryFactory, entityName),
    searchRecordsInAlgolia: getSearchRecordsInAlgolia(queryFactory, entityName),
  };
}

function getFindOneOrFail<T extends QueryFactoryFunction>(
  queryFactory: T,
  entityName: string
) {
  return async (
    context: Context,
    where: WhereFunctionFromQueryFactory<T>
  ): Promise<EntityFromQueryFactoryFunction<T>> => {
    const getQuery = await queryFactory(context);
    const query = getQuery();
    query.select("*");
    await where(query as QueryBuilderFromFactory<typeof queryFactory>);
    query.limit(1);
    const results = await query;
    if (!results[0]) {
      throw new errors.NotFoundError(`${entityName}.findOneOrFail: not found`);
    }
    return results[0];
  };
}

function getDeleteByIds<T extends QueryFactoryFunction>(queryFactory: T) {
  return async (context: Context, ids: string[]): Promise<void> => {
    const getQuery = await queryFactory(context);
    const query = getQuery();
    await query.delete().whereIn("id", ids);
  };
}

function getDeleteBy<T extends QueryFactoryFunction>(queryFactory: T) {
  return async (
    context: Context,
    where: WhereFunctionFromQueryFactory<T>
  ): Promise<void> => {
    const getQuery = await queryFactory(context);
    const query = getQuery();
    query.delete();
    await where(query as QueryBuilderFromFactory<typeof queryFactory>);
    return query;
  };
}

function getFindOneBy<T extends QueryFactoryFunction>(queryFactory: T) {
  return async (
    context: Context,
    where: WhereFunctionFromQueryFactory<T>
  ): Promise<EntityFromQueryFactoryFunction<T> | undefined> => {
    const getQuery = await queryFactory(context);
    const query = getQuery();
    query.select();
    await where(query as QueryBuilderFromFactory<typeof queryFactory>);
    const results = await query;
    return results[0];
  };
}

function getFindBy<T extends QueryFactoryFunction>(queryFactory: T) {
  return async (
    context: Context,
    where: WhereFunctionFromQueryFactory<T>
  ): Promise<EntityFromQueryFactoryFunction<T>[]> => {
    const getQuery = await queryFactory(context);
    const query = getQuery();
    query.select();
    await where(query as QueryBuilderFromFactory<typeof queryFactory>);
    return query;
  };
}

function getCreate<T extends QueryFactoryFunction>(
  queryFactory: T,
  entityName: string
) {
  const findOneOrFail = getFindOneOrFail(queryFactory, entityName);
  return async (
    context: Context,
    input: PartiallyMaybe<EntityFromQueryFactoryFunction<T>>
  ): Promise<EntityFromQueryFactoryFunction<T>> => {
    const id = (input as any)["id"] || ulid();
    const getQuery = await queryFactory(context);
    const query = getQuery();
    await query.insert({ id, ...input });
    return findOneOrFail(context, (q) => q.where("id", "=", id));
  };
}

function getUpdate<T extends QueryFactoryFunction>(queryFactory: T) {
  return async (
    context: Context,
    where: WhereFunctionFromQueryFactory<T>,
    newValues: PartiallyMaybe<EntityFromQueryFactoryFunction<T>>
  ): Promise<void> => {
    const getQuery = await queryFactory(context);
    const query = getQuery();
    query.update({ updatedAt: new Date(), ...newValues });
    await where(query as QueryBuilderFromFactory<typeof queryFactory>);
    return query;
  };
}

function getUpsert<T extends QueryFactoryFunction>(
  queryFactory: T,
  entityName: string,
  idProp: string = "id"
) {
  /**
   * Upserts a record. Please note that you must specify transactional boundaries if you
   * want to perform these upserts within a transaction.
   */
  return async (
    context: Context,
    upsertItems: PartiallyMaybeWithNull<EntityFromQueryFactoryFunction<T>>[],
    applyAdditionalWhereConstraints?: WhereFunctionFromQueryFactory<T>
  ): Promise<{ id: string; insertOrUpdate: "INSERT" | "UPDATE" }[]> => {
    const getQuery = await queryFactory(context);
    const payloads = await Promise.all(
      upsertItems.map(async (item) => {
        const query = getQuery();

        const idPropValue = item[idProp];
        const id = idPropValue || ulid();
        const insertOrUpdate = Boolean(idPropValue)
          ? ("UPDATE" as const)
          : ("INSERT" as const);

        if (insertOrUpdate === "UPDATE") {
          query.update({
            ...omit(item, idProp),
          });
          query.where(idProp, "=", id);
          await query.andWhere((q) => {
            q.whereRaw("1 = 1");
            applyAdditionalWhereConstraints?.(q as any);
          });
        } else {
          await query.insert({
            ...item,
            [idProp]: id,
          });
        }

        return { id, insertOrUpdate };
      })
    );

    await getUpsertRecordsToAlgolia(queryFactory, entityName)(context, {
      ids: payloads.map((p) => p.id),
    });

    return payloads;
  };
}

function getUpsertBy<T extends QueryFactoryFunction>(
  queryFactory: T,
  entityName: string,
  idProp: string = "id"
) {
  /**
   * Upserts a set of records by one or more unique constraints. Please note that
   * you must specify transactional boundaries if you want to perform these upserts
   * within a transaction.
   */
  return async <TColumns extends (keyof EntityFromQueryFactoryFunction<T>)[]>({
    context,
    items,
    columns,
  }: {
    context: Context;
    items: SomeRequired<
      PartiallyMaybeWithNull<EntityFromQueryFactoryFunction<T>>,
      TColumns[number]
    >[];
    columns: TColumns;
  }): Promise<
    ReturnTypeWithErrors<{ id: string; insertOrUpdate: "INSERT" | "UPDATE" }[]>
  > => {
    const getQuery = await queryFactory(context);
    const payloads = await Promise.all(
      items.map(async (item) => {
        let insertOrUpdate: "INSERT" | "UPDATE" = "INSERT";
        let id = "";

        const query = getQuery();

        const anyItem: any = item;
        query.whereRaw("1=1");
        for (const prop of columns as string[]) {
          query.andWhere(prop, "=", anyItem[prop]);
        }
        const extant = await query.limit(1);
        const element = extant[0];

        if (!element) {
          insertOrUpdate = "INSERT";
          id = ulid();

          await getQuery().insert({
            ...element,
            ...item,
            [idProp]: id,
          });
        } else {
          insertOrUpdate = "UPDATE";
          id = element.id;
          const query = getQuery().update({
            ...element,
            ...item,
            [idProp]: id,
          });
          query.whereRaw("1=1");
          for (const prop of columns as string[]) {
            query.andWhere(prop, "=", anyItem[prop]);
          }
          await query.limit(1);
        }

        return { id, insertOrUpdate };
      })
    );

    await getUpsertRecordsToAlgolia(queryFactory, entityName)(context, {
      ids: payloads.map((p) => p.id),
    });

    return payloads;
  };
}

function getConnection<T extends QueryFactoryFunction>(queryFactory: T) {
  return async <TEntity, TNode>(
    context: Context,
    input: {
      applyCustomConstraint?: (
        query: Knex.QueryBuilder<EntityFromQueryFactoryFunction<T>, any>
      ) => void;
      constraint?: PartiallyMaybe<EntityFromQueryFactoryFunction<T>>;
      connectionResolverParameters?: Parameters<
        typeof buildConnectionResolver
      >[1];
      nodeTransformer?: Parameters<typeof buildConnectionResolver>[2];
      additionalRootResolvers?: Record<string, any>;
    }
  ) => {
    try {
      const getQuery = await queryFactory(context);
      const query = getQuery();

      const constraint = input.constraint;
      if (constraint) {
        query.where((q) => {
          q.whereRaw("1=1");
          for (const [key, value] of Object.entries(constraint)) {
            if (value === undefined) continue;
            q.andWhere(key, value);
          }
        });
      }

      input.applyCustomConstraint?.(query);

      return buildConnectionResolver(
        query,
        {
          ...input.connectionResolverParameters,
        },
        input.nodeTransformer,
        input.additionalRootResolvers
      );
    } catch (error) {
      assertIsError(error);
      return error;
    }
  };
}

function getUpsertRecordsToAlgolia<T extends QueryFactoryFunction>(
  queryFactory: T,
  entityName: string
) {
  return async (
    context: Context,
    input: {
      ids: string[];
    }
  ) => {
    try {
      const algolia = await context.services
        .get(algoliaService)()
        .getIndex(entityName);
      const getQuery = await queryFactory(context);
      const query = getQuery();
      const entities = await query.select().whereIn("id", input.ids);
      await algolia.upsertObjects(entities);
    } catch (error) {
      log("error", "Error upserting records to Algolia", {
        error,
      });
    }
  };
}

function getSearchRecordsInAlgolia<T extends QueryFactoryFunction>(
  queryFactory: T,
  entityName: string
) {
  return async (
    context: Context,
    input: {
      searchTerm: string;
      filters?: string;
    }
  ): Promise<EntityFromQueryFactoryFunction<T>[]> => {
    try {
      const algolia = await context.services
        .get(algoliaService)()
        .getIndex(entityName);
      const searchResults: any[] = await algolia.searchObjects(
        input.searchTerm,
        input.filters
      );
      return searchResults;
    } catch (error) {
      log("error", "Error searching records in Algolia", {
        error,
      });
      return [];
    }
  };
}
