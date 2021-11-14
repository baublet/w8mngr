import { Knex, knex } from "knex";
import { Context } from "../context";

const dbSettings: Knex.Config = {
  client: "mysql",
  connection: {
    host: "db",
    user: "postgres",
    password: "postgres",
    database: "w8mngr-dev",
  },
};

// Our general-purpose query handler
async function getConnection(): Promise<Knex> {
  return knex(dbSettings);
}

async function dbService() {
  const connection = await getConnection();
  return {
    connection,
  };
}

export type DBConnection<TEntity = any> = Knex<TEntity>;
export type DBQuery<TEntity = any, TResult = any> = Knex.QueryBuilder<
  TEntity,
  TResult
>;

function getQueryProvider<TEntity = any>(tableName: string) {
  return async (
    context: Context,
    performQuery: (query: Knex.QueryBuilder<TEntity>) => any
  ) => {
    const { connection } = await context.services.get(dbService);

    const query = connection<TEntity>(tableName);
    await performQuery(query);

    return query;
  };
}

export { dbService, dbSettings, getQueryProvider };
