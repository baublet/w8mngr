import { Knex } from "knex";

import { withSchema } from "../api/config/db";

export async function up(knex: Knex): Promise<void> {
  await withSchema(knex).table("email", function (table) {
    table.text("idempotenceKey").notNullable().alter();
    table.text("idempotenceKey").unique().alter();
  });
}

export async function down(knex: Knex): Promise<void> {}
