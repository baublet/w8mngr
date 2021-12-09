import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", function (table) {
    table.text("id").notNullable().primary();
    table.string("preferredName");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
  await knex.schema.createTable("user_account", function (table) {
    table.text("id").notNullable().primary();
    table.text("userId").notNullable();
    table.text("source").notNullable();
    table.text("sourceIdentifier").index();
    table.text("passwordHash").nullable().index();
    table.text("tokenDigest").nullable().index();
    table.text("rememberTokenDigest").nullable().index();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
    table.unique(["source", "sourceIdentifier"]);
  });
  await knex.schema.createTable("token", function (table) {
    table.text("id").notNullable().primary();
    table.text("tokenDigest").unique().notNullable();
    table.text("type").notNullable().index();
    table.text("clientId").notNullable().index();
    table.text("userAccountId").notNullable().index();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.date("expires").notNullable();
  });
  await knex.schema.createTable("food_log", function (table) {
    table.text("id").notNullable().primary();
    table.text("userId").notNullable().index();
    table.text("day").notNullable().index();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
    table.text("description").notNullable();
    table.integer("calories").nullable();
    table.integer("fat").nullable();
    table.integer("carbs").nullable();
    table.integer("protein").nullable();
  });
  await knex.schema.createTable("food", function (table) {
    table.text("id").notNullable().primary();
    table.text("userId").notNullable().index();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
    table.text("name").notNullable();
    table.text("description").nullable();
    table.text("imageUploadId").nullable();
    table.integer("legacyId").nullable().index();
    table.text("ndbno").nullable().index();
  });
  await knex.schema.createTable("upload", function (table) {
    table.text("id").notNullable().primary();
    table.text("userId").notNullable().index();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
    table.text("publicId").index().unique().notNullable();
    table.text("entityType").nullable();
    table.text("entityId").nullable();
    table.text("extension").nullable();
  });
  await knex.schema.createTable("food_measurement", function (table) {
    table.text("id").notNullable().primary();
    table.text("foodId").notNullable().index();
    table.text("userId").notNullable().index();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
    table.integer("amount").notNullable().defaultTo(1);
    table.text("measurement").notNullable();
    table.integer("calories").notNullable().defaultTo(0);
    table.integer("fat").notNullable().defaultTo(0);
    table.integer("carbs").notNullable().defaultTo(0);
    table.integer("protein").notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {}
