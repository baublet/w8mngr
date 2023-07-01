import { Knex } from "knex";

import { withSchema } from "../api/config/db";

export async function up(knex: Knex): Promise<void> {
  await withSchema(knex).table("food", function (table) {
    table.boolean("archived").notNullable().defaultTo(false)
  });
}

export async function down(knex: Knex): Promise<void> {}
