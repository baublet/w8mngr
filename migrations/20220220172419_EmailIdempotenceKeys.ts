import { Knex } from "knex";
import { ulid } from "ulid";

import { attachSchema } from "../api/config/db";

export async function up(knex: Knex): Promise<void> {
  const results: { id: string }[] = await attachSchema(knex)
    .select("*")
    .from("email")
    .whereNull("idempotenceKey");

  await Promise.all(
    results.map(({ id }) => {
      return attachSchema(knex)
        .table("email")
        .update({ idempotenceKey: ulid() })
        .where("id", "=", id);
    })
  );
}

export async function down(knex: Knex): Promise<void> {}
