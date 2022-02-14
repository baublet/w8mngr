import { Knex } from "knex";

import { withSchema } from "../api/config/db";

export async function up(knex: Knex): Promise<void> {
  await withSchema(knex).createTable("user", function (table) {
    table.text("id").notNullable().primary();
    table.string("preferredName");
    table.string("legacyPreferences").nullable();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.string("role").nullable();
  });

  await withSchema(knex).createTable("user_account", function (table) {
    table.text("id").notNullable().primary();
    table.boolean("verified").defaultTo(false).index();
    table.text("userId").notNullable();
    table.text("source").notNullable().index();
    table.text("sourceIdentifier").index();
    table.text("passwordHash").nullable().index();
    table.text("tokenDigest").nullable().index();
    table.text("rememberTokenDigest").nullable().index();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.unique(["source", "sourceIdentifier"]);
  });

  await withSchema(knex).createTable("token", function (table) {
    table.text("id").notNullable().primary();
    table.text("tokenDigest").unique().notNullable();
    table.text("type").notNullable().index();
    table.text("clientId").notNullable().index();
    table.text("userAccountId").notNullable().index();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.date("expires").notNullable();
  });

  await withSchema(knex).createTable("food_log", function (table) {
    table.text("id").notNullable().primary();
    table.text("userId").notNullable().index();
    table.text("day").notNullable().index();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.text("description").notNullable();
    table.integer("calories").nullable();
    table.integer("fat").nullable();
    table.integer("carbs").nullable();
    table.integer("protein").nullable();
  });

  await withSchema(knex).createTable("food", function (table) {
    table.text("id").notNullable().primary();
    table.text("userId").notNullable().index();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.text("name").notNullable();
    table.text("description").nullable();
    table.text("imageUploadId").nullable();
    table.integer("legacyId").nullable().index();
    table.text("ndbno").nullable().index();
    table.integer("popularity").notNullable().defaultTo(0);
  });

  await withSchema(knex).createTable("food_log_food", function (table) {
    table.text("id").notNullable().primary();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.text("userId").notNullable().index();
    table.text("foodId").notNullable().index();
    table.text("day").notNullable().index();
  });

  await withSchema(knex).createTable("upload", function (table) {
    table.text("id").notNullable().primary();
    table.text("userId").notNullable().index();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.text("publicId").index().unique().notNullable();
    table.text("entityType").nullable();
    table.text("entityId").nullable();
    table.text("extension").nullable();
  });

  await withSchema(knex).createTable("food_measurement", function (table) {
    table.text("id").notNullable().primary();
    table.text("foodId").notNullable().index();
    table.text("userId").notNullable().index();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.decimal("amount").notNullable().defaultTo(1);
    table.text("measurement").notNullable();
    table.integer("calories").notNullable().defaultTo(0);
    table.integer("fat").notNullable().defaultTo(0);
    table.integer("carbs").notNullable().defaultTo(0);
    table.integer("protein").notNullable().defaultTo(0);
    table.integer("popularity").notNullable().defaultTo(0);
  });

  await withSchema(knex).createTable("activity", function (table) {
    table.boolean("archived").notNullable().defaultTo(false).index();
    table.text("id").notNullable().primary();
    table.text("userId").notNullable().index();
    table.text("name").notNullable();
    table.text("description").nullable();
    table.text("exrx").nullable().comment("ExRx.net link");
    table.text("type").notNullable().index();
    table.integer("intensity").notNullable().defaultTo(0);
    table.integer("popularity").notNullable().defaultTo(0).index();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.integer("legacyId").nullable().index().unique();
  });

  await withSchema(knex).createTable("activity_muscle", function (table) {
    table.text("id").notNullable().primary();
    table.text("activityId").notNullable().index();
    table.text("muscle").notNullable().index();
  });

  await withSchema(knex).createTable("activity_log", function (table) {
    table.text("id").notNullable().primary();
    table.text("activityId").notNullable().index();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.text("userId").notNullable().index();
    table.text("day").notNullable().index();
    table
      .integer("reps")
      .notNullable()
      .defaultTo(0)
      .comment("Only applicable for repetition-based exercises");
    table
      .integer("work")
      .notNullable()
      .defaultTo(0)
      .comment(
        "Depending on the activity type, this is either weight in grams (weighted exercise), distance in millimeters (distance exercise), or seconds (timed exercise)."
      );
  });

  await withSchema(knex).createTable("weight_log", function (table) {
    table.text("id").notNullable().primary();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.text("userId").notNullable().index();
    table.text("day").notNullable().index();
    table.integer("weight").notNullable().comment("Unit is stored in grams");
  });

  await withSchema(knex).createTable("email", function (table) {
    table.text("id").notNullable().primary();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.boolean("sent").defaultTo(false).notNullable().index();
    table.text("toEmail").notNullable();
    table.text("toUserId").nullable();
    table.text("templateId").notNullable();
    table.text("payload").notNullable().defaultTo("{}");
    table.text("history").notNullable().defaultTo("[]");
  });
}

export async function down(knex: Knex): Promise<void> {}
