export default {
  develop: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./dev.sqlite3",
    },
  },

  test: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: ":memory:",
    },
  },

  production: {
    client: "pg",
    version: "7.2",
    connection: process.env.DB_CONNECTION_STRING,
    searchPath: ["knex", "public"],
    pool: {
      min: 2,
      max: 10,
    },
  },
};
