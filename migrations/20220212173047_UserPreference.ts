import { Knex } from "knex";

import { withSchema } from "../api/config/db";

export async function up(knex: Knex): Promise<void> {
  await withSchema(knex).createTable("user_preference", function (table) {
    table.text("id").notNullable().primary();
    table.text("userId").notNullable().index();
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).defaultTo(knex.fn.now());
    table.text("preference").index().notNullable();
    table
      .text("value")
      .notNullable()
      .comment("The JSON.stringified value of the preference");
    table.unique(["userId", "preference"]);
  });
}

export async function down(knex: Knex): Promise<void> {}
