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
}

export async function down(knex: Knex): Promise<void> {}
