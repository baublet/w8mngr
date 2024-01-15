import type { Context } from "../createContext.js";
import {
  dbService,
  DBEnv,
  Database,
  UpdateQueryBuilder,
  SelectQueryBuilder,
  InsertableDatabaseRecord,
  DeleteQueryBuilder,
  SelectableDatabaseRecord,
} from "../config/db.js";
import { NotFoundError } from "../helpers/errors/NotFoundError.js";
import { buildConnectionResolver } from "../helpers/buildConnectionResolver/index.js";
import { assertIsError } from "../../shared/assertIsError.js";
import { getUniqueId } from "../../shared/getUniqueId.js";

type PartiallyMaybe<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] | undefined | null;
};

type PartiallyMaybeWithNull<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] | undefined | null;
};

export function createDataService<T extends keyof Database>({
  provider,
  tableName,
  idProp: _idProp,
}: {
  provider: keyof DBEnv;
  tableName: T;
  idProp?: keyof Database[T];
}) {
  const idProp = (_idProp || "id") as any;
  return {
    create: getCreate({ provider, tableName, idProp }),
    deleteByIds: getDeleteByIds({ provider, tableName, idProp }),
    deleteBy: getDeleteBy({ provider, tableName }),
    findOneBy: getFindOneBy({ provider, tableName }),
    findOneOrFailBy: getFindOneOrFailBy({ provider, tableName }),
    findBy: getFindBy({ provider, tableName }),
    findOneOrFail: getFindOneOrFail({ provider, tableName }),
    update: getUpdate({ provider, tableName }),
    upsert: getUpsert({ provider, tableName, idProp }),
    upsertBy: getUpsertBy({ provider, tableName }),
    getConnection: getConnectionBuilder({ provider, tableName }),
  };
}

function getUpsertBy<T extends keyof Database>({
  provider,
  tableName,
}: {
  provider: keyof DBEnv;
  tableName: T;
}) {
  return (
    context: Context,
    items: Partial<InsertableDatabaseRecord<Database[T]>>[],
    columns: (keyof InsertableDatabaseRecord<Database[T]>)[],
  ) => {
    return context.services
      .get(dbService)(provider)
      .insertInto(tableName)
      .values(items as any)
      .onConflict(
        (q: any) =>
          q.columns(columns as any).doUpdateSet({
            ...columns.reduce((acc, column) => {
              acc[column] = (eb: any) => eb.ref(`excluded.${String(column)}`);
              return acc;
            }, {} as any),
          }) as any,
      )
      .returningAll()
      .execute();
  };
}

function getFindBy<T extends keyof Database>({
  provider,
  tableName,
}: {
  provider: keyof DBEnv;
  tableName: T;
}) {
  return (
    context: Context,
    where: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
  ) => {
    return where(
      context.services.get(dbService)(provider).selectFrom(tableName) as any,
    )
      .selectAll()
      .execute();
  };
}

function getFindOneBy<T extends keyof Database>({
  provider,
  tableName,
}: {
  provider: keyof DBEnv;
  tableName: T;
}) {
  return (
    context: Context,
    where: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
  ) => {
    return where(
      context.services.get(dbService)(provider).selectFrom(tableName) as any,
    )
      .selectAll()
      .limit(1)
      .executeTakeFirst();
  };
}

function getFindOneOrFailBy<T extends keyof Database>({
  provider,
  tableName,
}: {
  provider: keyof DBEnv;
  tableName: T;
}) {
  return async (
    context: Context,
    where: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
  ) => {
    return (
      context.services.get(dbService)(provider).selectFrom(tableName) as any
    )
      .selectAll()
      .limit(1)
      .executeTakeFirstOrThrow();
  };
}

function getFindOneOrFail<T extends keyof Database>({
  provider,
  tableName,
}: {
  provider: keyof DBEnv;
  tableName: T;
}) {
  return async (context: Context, id: string) => {
    const result = await context.services
      .get(dbService)(provider)
      .selectFrom(tableName)
      .selectAll()
      .where("id" as any, "=", id as any)
      .limit(1)
      .executeTakeFirst();

    if (!result) {
      throw new NotFoundError(`${tableName}.findOneOrFail: not found`);
    }

    return result;
  };
}

function getDeleteByIds<T extends keyof Database>({
  provider,
  tableName,
  idProp,
}: {
  provider: keyof DBEnv;
  tableName: T;
  idProp: keyof Database[T];
}) {
  return async (context: Context, ids: string[]): Promise<void> => {
    await context.services
      .get(dbService)(provider)
      .deleteFrom(tableName)
      .where(idProp as any, "in", ids as any)
      .execute();
  };
}

function getDeleteBy<T extends keyof Database>({
  provider,
  tableName,
}: {
  provider: keyof DBEnv;
  tableName: T;
}) {
  return async (
    context: Context,
    where: (qb: DeleteQueryBuilder<T>) => DeleteQueryBuilder<T>,
  ): Promise<void> => {
    await where(
      context.services.get(dbService)(provider).deleteFrom(tableName) as any,
    ).execute();
  };
}

function getCreate<T extends keyof Database>({
  provider,
  tableName,
  idProp,
}: {
  provider: keyof DBEnv;
  tableName: T;
  idProp: keyof Database[T];
}) {
  return async (
    context: Context,
    input: Partial<InsertableDatabaseRecord<Database[T]>>[],
  ) => {
    if (input.length === 0) {
      return [];
    }

    const results = await context.services
      .get(dbService)(provider)
      .insertInto(tableName)
      .values(
        input.map((item) => ({ ...item, [idProp]: getUniqueId() })) as any,
      )
      .returningAll()
      .execute();

    return results;
  };
}

function getUpdate<T extends keyof Database>({
  provider,
  tableName,
}: {
  provider: keyof DBEnv;
  tableName: T;
}) {
  return async (
    context: Context,
    where: (qb: UpdateQueryBuilder<T>) => UpdateQueryBuilder<T>,
    newValues: PartiallyMaybe<InsertableDatabaseRecord<Database[T]>>,
  ) => {
    return where(
      context.services.get(dbService)(provider).updateTable(tableName) as any,
    )
      .set(newValues as any)
      .returningAll()
      .execute();
  };
}

function getUpsert<T extends keyof Database>({
  idProp = "id" as any,
  provider,
  tableName,
}: {
  provider: keyof DBEnv;
  tableName: T;
  idProp: keyof Database[T];
}) {
  /**
   * Upserts a record. Please note that you must specify transactional boundaries if you
   * want to perform these upserts within a transaction.
   */
  return async (
    context: Context,
    upsertItems: PartiallyMaybeWithNull<
      InsertableDatabaseRecord<Database[T]>
    >[],
    where: (qb: UpdateQueryBuilder<T>) => UpdateQueryBuilder<T> = (qb) => qb,
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
            .values({
              ...(upsertItem as any),
              [idProp]: getUniqueId(),
            })
            .returningAll()
            .execute();

          if (!result) {
            return {
              error: `Unexpected error in ${
                tableName as string
              }.upsert(insert): No result returned`,
            };
          }

          return { entity: result, insertOrUpdate: "INSERT" as const };
        }

        async function update() {
          const result = await where(
            context.services
              .get(dbService)(provider)
              .updateTable(tableName)
              .where(idProp as any, "=", (upsertItem as any)[idProp])
              .set(upsertItem as any) as any,
          )
            .returningAll()
            .execute();

          console.log("hello world");
          if (!result) {
            return {
              error: `Unexpected error in ${
                tableName as string
              }.upsert(update): No result returned`,
            };
          }

          return { entity: result, insertOrUpdate: "UPDATE" as const };
        }

        const id = (upsertItem as any)[idProp];

        if (typeof id === "undefined") {
          return insert();
        }

        const results = await context.services
          .get(dbService)(provider)
          .selectFrom(tableName)
          .select(idProp as any)
          .where(idProp as any, "=", id)
          .execute();

        if (results.length === 0) {
          return insert();
        }

        return update();
      }) as any,
    );
  };
}

function getConnectionBuilder<T extends keyof Database>({
  provider,
  tableName,
}: {
  provider: keyof DBEnv;
  tableName: T;
}) {
  return async <
    TEntity extends Record<string, any> = InsertableDatabaseRecord<Database[T]>,
    TNode extends Record<string, any> = TEntity,
  >(
    context: Context,
    input: {
      applyCustomConstraint?: (
        query: SelectQueryBuilder<T>,
      ) => SelectQueryBuilder<T>;
      constraint?: PartiallyMaybe<InsertableDatabaseRecord<Database[T]>>;
      connectionResolverParameters?: {
        before?: string | null;
        last?: number | null;
        first?: number | null;
        after?: string | null;
        sort?: Record<string | keyof TEntity, "asc" | "desc">;
        idProp?: string;
      };
      nodeTransformer?: (
        node: SelectableDatabaseRecord<Database[T]>,
      ) => Promise<TNode>;
      additionalRootResolvers?: Record<string, any>;
    },
  ) => {
    try {
      let query = context.services
        .get(dbService)(provider)
        .selectFrom(tableName);

      const constraint = input.constraint;
      const constraintEntries = (
        constraint ? Object.entries(constraint) : []
      ).filter((pair) => typeof pair[1] !== "undefined");
      if (constraintEntries.length > 0) {
        query = query.where((eb) =>
          eb.and(
            constraintEntries.map(([key, value]) => eb(key as any, "=", value)),
          ),
        );
      }

      query = (input.applyCustomConstraint?.(query as any) as any) || query;

      return buildConnectionResolver<TEntity, TNode>(
        query,
        input.connectionResolverParameters,
        input.nodeTransformer as any, // Library code... can fix later
        input.additionalRootResolvers,
      );
    } catch (error) {
      assertIsError(error);
      return error;
    }
  };
}
