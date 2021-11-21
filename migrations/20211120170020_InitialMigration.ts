import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", function (table) {
    table.text("id").index().unique().primary();
    table.string("preferredName");
    table.timestamps();
  });
  await knex.schema.createTable("user_account", function (table) {
    table.text("id").index().unique().primary();
    table.text("userId").notNullable();
    table.text("source").notNullable();
    table.text("sourceIdentifier").index();
    table.text("passwordDigest").nullable().index();
    table.text("tokenDigest").nullable().index();
    table.text("rememberTokenDigest").nullable().index();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());

    table.unique(["source", "sourceIdentifier"])
  });
}

export async function down(knex: Knex): Promise<void> {}
