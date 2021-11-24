import { Knex } from "knex";
import { ulid } from "ulid";

import { assertIsTruthy } from "../../shared";
import { dbService } from "../config";
import { Context } from "../createContext";
import { errors, buildConnectionResolver } from "../helpers";

type PartiallyMaybe<T extends Record<string, any>> = {
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
    findOneOrFail: getFindOneOrFail(queryFactory, entityName),
    deleteByIds: getDeleteByIds(queryFactory),
    create: getCreate(queryFactory, entityName),
    update: getUpdate(queryFactory),
    getConnection: getConnection(queryFactory),
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
    query.update(newValues);
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
    upsertItems: PartiallyMaybe<EntityFromQueryFactoryFunction<T>>[],
    applyAdditionalWhereConstraints?: WhereFunctionFromQueryFactory<T>
  ): Promise<{ id: string; insertOrUpdate: "INSERT" | "UPDATE" }[]> => {
    const databaseService = await context.services.get(dbService);
    await databaseService.transact();

    try {
      const getQuery = await queryFactory(context);
      const query = getQuery();

      const payloads = await Promise.all(
        upsertItems.map(async (item) => {
          const id = item[idProp] || ulid();
          assertIsTruthy(id);

          const insertOrUpdate = item[idProp]
            ? ("UPDATE" as const)
            : ("INSERT" as const);

          if (insertOrUpdate === "UPDATE") {
            query.update({
              ...item,
            });
            await applyAdditionalWhereConstraints?.(query as any);
            await query.where(idProp, "=", id);
          } else {
            await query.insert({
              ...item,
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
      constraint?: PartiallyMaybe<EntityFromQueryFactoryFunction<T>>;
      connectionResolverParameters?: Parameters<
        typeof buildConnectionResolver
      >[1];
      nodeTransformer?: Parameters<typeof buildConnectionResolver>[2];
    }
  ) => {
    const getQuery = await queryFactory(context);
    const query = getQuery();

    const constraint = input.constraint;
    if (constraint) {
      for (const [key, value] of Object.entries(constraint)) {
        query.andWhere(key, "=", value as any);
      }
    }

    return buildConnectionResolver(
      query,
      {
        ...input.connectionResolverParameters,
      },
      input.nodeTransformer
    );
  };
}
