import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("activity_log", function (table) {
    table.boolean("archived").notNullable().defaultTo(false).index();
  });
}

export async function down(knex: Knex): Promise<void> {}
