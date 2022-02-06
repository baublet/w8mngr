// Don't export this from `api/config`, or we'll hit an annoying little circular dependency issue.
import { config } from "./api/config/config";

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
};
