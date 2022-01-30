import { ServiceContainer } from "@baublet/service-container";
import DataLoader from "dataloader";
import { Knex } from "knex";
import omit from "lodash.omit";
import { ulid } from "ulid";

import { assertIsError } from "../../shared";
import { dbService } from "../config/db";
import { Context, contextService } from "../createContext";
import { buildConnectionResolver, errors } from "../helpers";

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
    getLoader: getLoaderFactory(queryFactory),
    update: getUpdate(queryFactory),
    upsert: getUpsert(queryFactory),
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

function getLoaderFactory<T extends QueryFactoryFunction>(queryFactory: T) {
  function getLoaderService(serviceContainer: ServiceContainer) {
    const context = serviceContainer.get(contextService);
    return new DataLoader<string, EntityFromQueryFactoryFunction<T>>(
      async (ids: readonly string[]) => {
        const getQuery = await queryFactory(context);
        return getQuery().select().whereIn("id", ids);
      }
    );
  }
  return async (context: Context) => {
    return context.services.get(getLoaderService);
  };
}

function getFindOneBy<T extends QueryFactoryFunction>(queryFactory: T) {
  return async (
    context: Context,
    where: WhereFunctionFromQueryFactory<T>
  ): Promise<EntityFromQueryFactoryFunction<T>> => {
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
  idProp: string = "id"
) {
  return async (
    context: Context,
    upsertItems: PartiallyMaybeWithNull<EntityFromQueryFactoryFunction<T>>[],
    applyAdditionalWhereConstraints?: WhereFunctionFromQueryFactory<T>
  ): Promise<{ id: string; insertOrUpdate: "INSERT" | "UPDATE" }[]> => {
    const databaseService = await context.services.get(dbService);
    await databaseService.transact();

    const getQuery = await queryFactory(context);
    try {
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

      await databaseService.commit();
      return payloads;
    } catch (error) {
      await databaseService.rollback(error);
      throw error;
    }
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
