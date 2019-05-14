import { query, dbSettings } from "../api/config/db";
import { readFileSync } from "fs";

const sqlFileContent = readFileSync("./test/initial_structure.sql") + "";

const dropDb = async () =>
  await query({
    text: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
  });

const setupDb = async () => {
  const lines: Array<string> = sqlFileContent.split(";\n");
  for (let i = 0; i < lines.length; i++) {
    try {
      await query({
        text: lines[i]
      });
    } catch (e) {
      console.error("ERROR AT LINE ", i, lines[i]);
      console.log(e);
      process.exit(1);
    }
  }
};

(async (dropDb, setupDb) => {
  try {
    try {
      await dropDb();
    } catch (e) {}
    await setupDb();
  } catch (e) {
    switch (e.errno) {
      case "ECONNREFUSED":
        console.error(
          "Unable to connect to Postgres. We do fully functional testing, and therefore require a functioning DB connection to run our integration tests.\n\n"
        );
        break;
      default:
        console.error("Unknown error!");
    }
    console.log(e);
  }
})(dropDb, setupDb);
