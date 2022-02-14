import { Knex, knex } from "knex";

import knexConfig from "../../knexfile";
import type { Context } from "../createContext";
import { config } from "./config";
import { log } from "./log";

export type Connection<TEntity = any> = Knex<TEntity, unknown[]>;
export type QueryBuilder<T = any> = Knex.QueryBuilder<T, any>;

const database = config.get("DATABASE");
assertIsValidDatabase(database);
const dbSettings: Knex.Config = knexConfig[database];

export function withSchema(knex: Knex) {
  return knex.schema.withSchema(config.get("DATABASE_SCHEMA"));
}

function assertIsValidDatabase(
  database: string
): asserts database is keyof typeof knexConfig {
  if (database in knexConfig) {
    return;
  }
  throw new Error(`Invalid database config environment: ${database}`);
}

if (!dbSettings) {
  throw new Error(
    `Unable to startup. Invalid database config. Database: ${database}. Available databases: ${Object.keys(
      knexConfig
    )}`
  );
} else {
  if (config.get("NODE_ENV") !== "test") {
    log("info", "Database driver initializing", { dbSettings });
  }
}

// Our general-purpose query handler
const openConnections: any[] = []; // We track them so we can free them up and shut down the app safely

export async function getConnection(): Promise<Knex> {
  log("info", "Requesting a database connection from the pool", {
    openConnections: openConnections.length,
  });
  const connection = knex(dbSettings);
  openConnections.push(connection);
  return connection;
}

function closeConnection(connection: any) {
  if (!openConnections.includes(connection)) {
    return;
  }

  openConnections.splice(openConnections.indexOf(connection), 1);
  return connection?.destroy?.();
}

async function dbService() {
  let schema = "public";
  const connection = await getConnection();
  const serviceConnections: any[] = [connection];
  let transactingConnection: Knex.Transaction<any, any[]> | undefined;

  return {
    getConnection: () => {
      return transactingConnection || connection;
    },
    transact: async () => {
      if (!transactingConnection) {
        transactingConnection = await connection.transaction();
      }
    },
    commit: async () => {
      if (transactingConnection) {
        await transactingConnection.commit();
        transactingConnection = undefined;
      }
    },
    destroy: async () => {
      await transactingConnection?.commit();
      await Promise.all(serviceConnections.map(closeConnection));
    },
    rollback: async (error: unknown) => {
      log("warn", "Transaction failed. Rolling back.", { error });
      await transactingConnection?.rollback();
    },
    setSchema: (newSchema: string) => {
      schema = newSchema;
    },
    getSchema: () => schema,
  };
}

export type DBConnection<TEntity = any> = Knex<TEntity>;
export type DBQuery<TEntity = any, TResult = any> = Knex.QueryBuilder<
  TEntity,
  TResult
>;

function getQueryBuilderFactory<TEntity = any>(tableName: string) {
  return async (context: Context) => {
    const dbFactory = await context.services.get(dbService);
    const { getConnection } = dbFactory;
    const connection = await getConnection();
    return () =>
      connection<TEntity>(tableName).withSchema(dbFactory.getSchema());
  };
}

export { dbService, dbSettings, getQueryBuilderFactory };

export type QueryBuilderForQuery<
  T extends (
    context: Context,
    performQuery: (query: Knex.QueryBuilder<any, any>) => any
  ) => Promise<any[]>
> = Parameters<Parameters<T>[1]>[0];
