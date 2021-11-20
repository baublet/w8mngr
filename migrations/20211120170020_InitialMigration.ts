import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('users', function (table) {
    table.text("id").index().unique().primary();
    table.string('preferredName');
    table.timestamps();
  })
}


export async function down(knex: Knex): Promise<void> {
}

