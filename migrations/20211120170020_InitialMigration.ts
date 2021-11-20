import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", function (table) {
    table.text("id").index().unique().primary();
    table.string("preferredName");
    table.timestamps();
  });
  await knex.schema.createTable("user_account", function (table) {
    table.text("id").index().unique().primary();
    table.text("userId").index();
    table.text("source");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {}
