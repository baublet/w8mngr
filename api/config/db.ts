import path from "path";

import { ServiceContainer } from "@baublet/service-container";
import { Knex, knex } from "knex";

import knexConfig from "../../knexfile";
import { Context, createContext } from "../createContext";
import { config } from "./config";
import { log } from "./log";

export type Connection<TEntity = any> = Knex<TEntity, unknown[]>;
export type QueryBuilder<T = any> = Knex.QueryBuilder<T, any>;

const database = config.get("DATABASE");
assertIsValidDatabase(database);
const dbSettings: Knex.Config = knexConfig[database];

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
export async function getConnection(): Promise<Knex> {
  return knex(dbSettings);
}

async function dbService() {
  const connection = await getConnection();
  let transactingConnection: Knex.Transaction<any, any[]> | undefined;

  return {
    getConnection: () => transactingConnection || connection,
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
    close: () => transactingConnection?.commit(),
    rollback: async (error: unknown) => {
      log("warn", "Transaction failed. Rolling back.", { error });
      await transactingConnection?.rollback();
    },
  };
}

export type DBConnection<TEntity = any> = Knex<TEntity>;
export type DBQuery<TEntity = any, TResult = any> = Knex.QueryBuilder<
  TEntity,
  TResult
>;

function getQueryBuilderFactory<TEntity = any>(tableName: string) {
  return async (context: Context) => {
    const { getConnection } = await context.services.get(dbService);
    const connection = await getConnection();
    return () => connection<TEntity>(tableName);
  };
}

function getQueryProvider<TEntity = any>(tableName: string) {
  return async (
    context: Context,
    performQuery: <T extends Knex.QueryBuilder<TEntity>>(
      query: T
    ) => T | Promise<T>
  ) => {
    const { getConnection } = await context.services.get(dbService);
    const connection = await getConnection();

    const query = connection<TEntity>(tableName);
    const results = await performQuery(query);
    log("debug", query.toQuery(), { bindings: query.toSQL().bindings });
    return results;
  };
}

export { dbService, dbSettings, getQueryProvider, getQueryBuilderFactory };

export type QueryBuilderForQuery<
  T extends (
    context: Context,
    performQuery: (query: Knex.QueryBuilder<any, any>) => any
  ) => Promise<any[]>
> = Parameters<Parameters<T>[1]>[0];

const testGlobalContext = createContext();
const testGlobalServiceContainer: ServiceContainer = testGlobalContext.services;

export function getTestGlobalContext(): Context {
  return testGlobalContext;
}

export function getTestGlobalServiceContainer(): ServiceContainer {
  if (config.get("NODE_ENV") !== "test") {
    throw new Error(
      `Invalid environment to use the global testing service container. Environment: ${config.get("NODE_ENV")}`
    );
  }
  return testGlobalServiceContainer;
}

export async function testSetup() {
  const databaseService = await getTestGlobalContext().services.get(dbService);
  const connection = await databaseService.getConnection();
  await connection.migrate.latest({
    directory: path.resolve(process.cwd(), "migrations"),
  });
}

export async function testCleanup() {
  const databaseService = await getTestGlobalContext().services.get(dbService);
  const connection = await databaseService.getConnection();
  await connection.destroy();
  getTestGlobalContext().services.delete(dbService);
}

export async function getTestGlobalDatabaseConnection() {
  const service = await getTestGlobalServiceContainer().get(dbService);
  const connection = await service.getConnection();
  await connection.migrate.latest();
  return connection;
}
