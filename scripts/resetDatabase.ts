import knex from "knex";
import config from "../knexfile";

const db = knex(config.production);

(async () => {
  console.log("Dropping existing database...")
  await db.raw('DROP DATABASE IF EXISTS "better-mantis-4973.defaultdb"');
  console.log("Recreating database...")
  await db.raw('CREATE DATABASE IF NOT EXISTS "better-mantis-4973.defaultdb"');
  process.exit(0);
})();
