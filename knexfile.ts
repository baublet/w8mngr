export default {
  develop: {
    client: require("knex/lib/dialects/sqlite3"),
    useNullAsDefault: true,
    connection: {
      filename: "./dev.sqlite3",
    },
  },

  test: {
    client: require("knex/lib/dialects/sqlite3"),
    useNullAsDefault: true,
    connection: {
      filename: ":memory:",
    },
  },

  production: {
    client: require("knex/lib/dialects/postgres"),
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
