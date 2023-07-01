import { Knex } from "knex";

import { attachSchema } from "../api/config/db";

export async function up(knex: Knex): Promise<void> {
  const results: { id: string }[] = await attachSchema(knex)
    .select("*")
    .from("user_account")
    .where("sourceIdentifier", "=", "baublet@gmail.com");

  if (results.length !== 1) {
    console.warn(
      "Expected exactly one user account with sourceIdentifier, but got zero or more than one."
    );
    return;
  }

  const result = results[0];

  await attachSchema(knex)
    .table("user")
    .update({ role: "admin" })
    .where("id", "=", result.id)
    .limit(1);
}

export async function down(knex: Knex): Promise<void> {}
