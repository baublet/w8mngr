import { config } from "./api/config";

export default {
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
    connection: config.get("DB_CONNECTION_STRING"),
    pool: {
      min: 2,
      max: 10,
    },
  },

  legacy: {
    client: "pg",
    connection: config.get("LEGACY_DB_CONNECTION_STRING"),
  },
};
