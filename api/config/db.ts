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
let openConnections = 0;
export async function getConnection(): Promise<Knex> {
  log("info", "Grabbing a database connection from the pool", {
    openConnections: openConnections + 1,
  });
  openConnections++;
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
    close: async () => {
      await transactingConnection?.commit();
    },
    destroy: async () => {
      log("info", "Destroying database connections", { openConnections });
      await connection.destroy();
      openConnections--;
      if (transactingConnection) {
        await transactingConnection.destroy();
        openConnections--;
      }
      log("info", "Database connections destroyed", { openConnections });
    },
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

export { dbService, dbSettings, getQueryBuilderFactory };

export type QueryBuilderForQuery<
  T extends (
    context: Context,
    performQuery: (query: Knex.QueryBuilder<any, any>) => any
  ) => Promise<any[]>
> = Parameters<Parameters<T>[1]>[0];
