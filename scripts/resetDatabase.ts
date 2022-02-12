import knex from "knex";

import config from "../knexfile";

const db = knex(config.production);

(async () => {
  console.log("Dropping existing database...");
  await db.raw('DROP SCHEMA IF EXISTS "public" CASCADE');

  console.log("Recreating database...");
  await db.raw('CREATE SCHEMA IF NOT EXISTS "public"');

  await db.destroy();
  process.exit(0);
})();
