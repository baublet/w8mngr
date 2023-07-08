import { ServiceContainer } from "@baublet/service-container";
import { D1Database } from "@cloudflare/workers-types";
import {
  Kysely,
  Insertable,
  UpdateResult,
  UpdateQueryBuilder as KyselyUpdateQueryBuilder,
  SelectQueryBuilder as KyselySelectQueryBuilder,
  DeleteQueryBuilder as KyselyDeleteQueryBuilder,
} from "kysely";
import { DB } from "kysely-codegen";
import { D1Dialect } from "kysely-d1";

import { W8mngrMap } from "../../shared/Map";

export interface Env {
  W8MNGR_1: D1Database;
}

export { sql } from "kysely";

export type Database = DB;
export type QueryBuilder = Kysely<DB>;
export type UpdateQueryBuilder<T extends keyof Database> =
  KyselyUpdateQueryBuilder<DB, T, T, UpdateResult>;
export type SelectQueryBuilder<T extends keyof Database> =
  KyselySelectQueryBuilder<DB, T, {}>;
export type InsertableDatabaseRecord<T> = Insertable<T>;
export type DeleteQueryBuilder<T extends keyof Database> =
  KyselyDeleteQueryBuilder<DB, T, unknown>;

function envService(): Env {
  throw new Error("You must set the env service value before using it");
}

function dbService(container: ServiceContainer) {
  const env = container.get(envService);
  const dbMaps = new W8mngrMap<keyof Env, Kysely<DB>>();
  return (db: keyof Env) =>
    dbMaps.getOrSet(
      db,
      () =>
        new Kysely({
          dialect: new D1Dialect({ database: env[db] }),
        })
    );
}

export { dbService };
