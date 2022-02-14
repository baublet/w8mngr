import { Knex } from "knex";

import { withSchema } from "../api/config/db";

export async function up(knex: Knex): Promise<void> {
  await withSchema(knex).alterTable("activity_log", function (table) {
    table.boolean("archived").notNullable().defaultTo(false).index();
  });
}

export async function down(knex: Knex): Promise<void> {}
