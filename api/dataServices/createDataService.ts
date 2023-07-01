import type { Context } from "../createContext";
import {
  dbService,
  Env,
  Database,
  UpdateQueryBuilder,
  SelectQueryBuilder,
  InsertableDatabaseRecord,
  DeleteQueryBuilder,
} from "../config/db";
import { NotFoundError } from "../helpers/errors/NotFoundError";
import { buildConnectionResolver } from "../helpers/buildConnectionResolver";
import { assertIsError } from "../../shared/assertIsError";

type PartiallyMaybe<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] | undefined;
};

type PartiallyMaybeWithNull<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] | undefined | null;
};

export function createDataService<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return {
    create: getCreate(provider, tableName),
    deleteByIds: getDeleteByIds(provider, tableName),
    deleteBy: getDeleteBy(provider, tableName),
    findOneBy: getFindOneBy(provider, tableName),
    findOneOrFailBy: getFindOneOrFailBy(provider, tableName),
    findBy: getFindBy(provider, tableName),
    findOneOrFail: getFindOneOrFail(provider, tableName),
    update: getUpdate(provider, tableName),
    upsert: getUpsert(provider, tableName),
    upsertBy: getUpsertBy(provider, tableName),
    getConnection: getConnectionBuilder(provider, tableName),
  };
}

function getUpsertBy<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return (
    context: Context,
    items: Partial<InsertableDatabaseRecord<Database[T]>>[],
    columns: (keyof InsertableDatabaseRecord<Database[T]>)[]
  ) => {
    return context.services
      .get(dbService)(provider)
      .insertInto(tableName)
      .values(items as any)
      .onConflict(
        (q) =>
          q.columns(columns as any).doUpdateSet({
            ...columns.reduce((acc, column) => {
              acc[column] = (eb: any) => eb.ref(`excluded.${String(column)}`);
              return acc;
            }, {} as any),
          }) as any
      );
  };
}

function getFindBy<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return (
    context: Context,
    where: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>
  ) => {
    return where(
      context.services.get(dbService)(provider).selectFrom(tableName) as any
    )
      .selectAll()
      .execute();
  };
}

function getFindOneBy<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return (
    context: Context,
    where: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>
  ) => {
    return where(
      context.services.get(dbService)(provider).selectFrom(tableName) as any
    )
      .selectAll()
      .limit(1)
      .executeTakeFirst();
  };
}

function getFindOneOrFailBy<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return (
    context: Context,
    where: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>
  ) => {
    return where(
      context.services.get(dbService)(provider).selectFrom(tableName) as any
    )
      .selectAll()
      .limit(1)
      .executeTakeFirstOrThrow();
  };
}

function getFindOneOrFail<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return async (context: Context, id: string) => {
    const result = await context.services
      .get(dbService)(provider)
      .selectFrom(tableName)
      .selectAll()
      .where("id", "=", id as any)
      .limit(1)
      .executeTakeFirst();

    if (!result) {
      throw new NotFoundError(`${tableName}.findOneOrFail: not found`);
    }

    return result;
  };
}

function getDeleteByIds<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return async (context: Context, ids: string[]): Promise<void> => {
    await context.services
      .get(dbService)(provider)
      .deleteFrom(tableName)
      .where("id", "in", ids as any)
      .execute();
  };
}

function getDeleteBy<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return async (
    context: Context,
    where: (qb: DeleteQueryBuilder<T>) => DeleteQueryBuilder<T>
  ): Promise<void> => {
    await where(
      context.services.get(dbService)(provider).deleteFrom(tableName) as any
    ).execute();
  };
}

function getCreate<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return async (
    context: Context,
    input: Partial<InsertableDatabaseRecord<Database[T]>>[]
  ) => {
    if (input.length === 0) {
      return [];
    }

    const results = await context.services
      .get(dbService)(provider)
      .insertInto(tableName)
      .values(input as any)
      .returningAll()
      .execute();

    return results;
  };
}

function getUpdate<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return async (
    context: Context,
    where: (qb: UpdateQueryBuilder<T>) => UpdateQueryBuilder<T>,
    newValues: PartiallyMaybe<InsertableDatabaseRecord<Database[T]>>
  ) => {
    return where(
      context.services.get(dbService)(provider).updateTable(tableName) as any
    )
      .set(newValues as any)
      .returningAll()
      .execute();
  };
}

function getUpsert<T extends keyof Database>(
  provider: keyof Env,
  tableName: T,
  idProp: keyof Database[T] = "id"
) {
  /**
   * Upserts a record. Please note that you must specify transactional boundaries if you
   * want to perform these upserts within a transaction.
   */
  return async (
    context: Context,
    upsertItems: PartiallyMaybeWithNull<
      InsertableDatabaseRecord<Database[T]>
    >[],
    where: (qb: UpdateQueryBuilder<T>) => UpdateQueryBuilder<T> = (qb) => qb
  ): Promise<
    (
      | {
          entity: InsertableDatabaseRecord<Database[T]>;
          insertOrUpdate: "INSERT" | "UPDATE";
        }
      | { error: string }
    )[]
  > => {
    return Promise.all(
      upsertItems.map(async (upsertItem) => {
        async function insert() {
          const result = await context.services
            .get(dbService)(provider)
            .insertInto(tableName)
            .values(upsertItem as any)
            .returningAll()
            .execute();

          if (!result) {
            return {
              error: `Unexpected error in ${tableName}.upsert(insert): No result returned`,
            };
          }

          return { entity: result, insertOrUpdate: "INSERT" as const };
        }

        async function update() {
          const result = await where(
            context.services
              .get(dbService)(provider)
              .updateTable(tableName)
              .set(upsertItem as any) as any
          )
            .returningAll()
            .execute();

          if (!result) {
            return {
              error: `Unexpected error in ${tableName}.upsert(update): No result returned`,
            };
          }

          return { entity: result, insertOrUpdate: "UPDATE" as const };
        }

        const id = (upsertItem as any)[idProp];
        if (!id) {
          return { error: `No id provided for upsert in ${tableName}` };
        }

        const results = await context.services
          .get(dbService)(provider)
          .selectFrom(tableName)
          .select(idProp as any)
          .where(idProp as any, "=", id)
          .execute();

        //
        // Insert!
        //
        if (results.length === 0) {
          return insert();
        }

        //
        // Otherwise, update
        //
        return update();
      }) as any
    );
  };
}

function getConnectionBuilder<T extends keyof Database>(
  provider: keyof Env,
  tableName: T
) {
  return async (
    context: Context,
    input: {
      applyCustomConstraint?: (
        query: SelectQueryBuilder<T>
      ) => SelectQueryBuilder<T>;
      constraint?: PartiallyMaybe<InsertableDatabaseRecord<Database[T]>>;
      connectionResolverParameters?: Parameters<
        typeof buildConnectionResolver
      >[1];
      nodeTransformer?: Parameters<typeof buildConnectionResolver>[2];
      additionalRootResolvers?: Record<string, any>;
    }
  ) => {
    try {
      let query = context.services
        .get(dbService)(provider)
        .selectFrom(tableName)
        .selectAll();

      const constraint = input.constraint;
      if (constraint) {
        query = query.where((q) =>
          q.and(
            Object.entries(constraint).map(([key, value]) =>
              q.cmpr(key as any, "=", value)
            )
          )
        );
      }

      query = (input.applyCustomConstraint?.(query as any) as any) || query;

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
