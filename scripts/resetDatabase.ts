import knex from "knex";

import config from "../knexfile";

const db = knex(config.production);

throw new Error("Don't run this.");

(async () => {
  console.log("Dropping existing database...");
  await db.raw('DROP DATABASE IF EXISTS "defaultdb"');

  console.log("Recreating database...");
  await db.raw('CREATE DATABASE IF NOT EXISTS "defaultdb"');

  process.exit(0);
})();
