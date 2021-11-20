import {
  createServiceContainer,
  ServiceContainer,
} from "@baublet/service-container";
import { Knex, knex } from "knex";

import { Context } from "../createContext";
import { log } from "./log";
import knexConfig from "../../knexfile";

const environment = process.env.NODE_ENV || "develop";
assertIsValidEnvironment(environment);
const dbSettings: Knex.Config = knexConfig[environment];

function assertIsValidEnvironment(
  environment: string
): asserts environment is keyof typeof knexConfig {
  if (environment in knexConfig) {
    return;
  }
  throw new Error(`Invalid database config environment: ${environment}`);
}

if (!dbSettings) {
  throw new Error(
    `Unable to startup. Invalid database config. Environment: ${environment}. Available environments: ${Object.keys(
      knexConfig
    )}`
  );
} else {
  console.log("\n")
  log("info", "Database driver initializing", { dbSettings });
}

// Our general-purpose query handler
async function getConnection(): Promise<Knex> {
  return knex(dbSettings);
}

async function dbService() {
  const connection = await getConnection();
  return {
    getConnection: () => connection,
    closeConnection: () => connection.destroy(),
  };
}

export type DBConnection<TEntity = any> = Knex<TEntity>;
export type DBQuery<TEntity = any, TResult = any> = Knex.QueryBuilder<
  TEntity,
  TResult
>;

function getQueryProvider<TEntity = any>(tableName: string) {
  return async (
    context: Context,
    performQuery: (query: Knex.QueryBuilder<TEntity>) => any
  ) => {
    const { getConnection } = await context.services.get(dbService);
    const connection = await getConnection();

    const query = connection<TEntity>(tableName);
    await performQuery(query);

    return query;
  };
}

export { dbService, dbSettings, getQueryProvider };

export type QueryBuilderForQuery<
  T extends (
    context: Context,
    performQuery: (query: Knex.QueryBuilder<any, any>) => any
  ) => Promise<any[]>
> = Parameters<Parameters<T>[1]>[0];

const testGlobalServiceContainer: ServiceContainer = createServiceContainer();
export function getTestGlobalServiceContainer(): ServiceContainer {
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      `Invalid environment to use the global testing service container. Environment: ${process.env.NODE_ENV}`
    );
  }
  return testGlobalServiceContainer;
}
