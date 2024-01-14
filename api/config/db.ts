import { ServiceContainer } from "@baublet/service-container";
import { D1Database } from "@cloudflare/workers-types";
import {
  Kysely,
  Insertable,
  Selectable,
  Simplify,
  UpdateResult,
  UpdateQueryBuilder as KyselyUpdateQueryBuilder,
  SelectQueryBuilder as KyselySelectQueryBuilder,
  DeleteQueryBuilder as KyselyDeleteQueryBuilder,
} from "kysely";
import { D1Dialect } from "kysely-d1";
import { DB } from "./db.types.js";

import { W8mngrMap } from "../../shared/Map.js";

export type DBEnv = {
  W8MNGR_1: D1Database;
};

export { sql } from "kysely";

export type Database = DB;
export type QueryBuilder = Kysely<DB>;
export type UpdateQueryBuilder<T extends keyof Database> =
  KyselyUpdateQueryBuilder<DB, T, T, UpdateResult>;
export type SelectQueryBuilder<T extends keyof Database> =
  KyselySelectQueryBuilder<DB, T, {}>;
export type InsertableDatabaseRecord<T> = Insertable<T>;
export type SelectableDatabaseRecord<T> = Selectable<T>;
export type DeleteQueryBuilder<T extends keyof Database> =
  KyselyDeleteQueryBuilder<DB, T, unknown>;
export type EntityType<T> = Simplify<T>;

export function dbEnvService(): DBEnv {
  throw new Error("You must set the env service value before using it");
}

function dbService(container: ServiceContainer) {
  const env = container.get(dbEnvService);
  const dbMaps = new W8mngrMap<keyof DBEnv, Kysely<DB>>();
  return (db: keyof DBEnv) =>
    dbMaps.getOrSet(
      db,
      () =>
        new Kysely({
          dialect: new D1Dialect({ database: env[db] }) as any,
        }),
    );
}

export { dbService };
