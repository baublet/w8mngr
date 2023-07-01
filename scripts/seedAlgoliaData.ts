import knex from "knex";

import { config } from "../api/config/config";
import { createContext } from "../api/createContext";
import { foodDataService } from "../api/dataServices";
import knexConfig from "../knexfile";

const database = config.get("DATABASE");
const newDb = knex((knexConfig as any)[database]);
const getNewDb = () => newDb;

const context = createContext({
  clientId: "upsertRecordsToAlgolia",
});

(async () => {
  console.log("Initializing and testing database connection");

  await getNewDb().raw("SELECT 1");

  console.log(
    "Databases working! Connections: ",
    JSON.stringify({
      newDatabase: database,
    })
  );
})().then(async () => {
  await seedFoods();
  console.log("Done");
  process.exit(0);
});

async function seedFoods() {
  console.log("Seeding legacy food entries into the new food entries table");

  let hasMore = true;
  let offset = 0;
  const batchSize = 500;
  let total = 0;

  while (hasMore) {
    const entries = await getNewDb()
      .select("id")
      .from("food")
      .offset(offset)
      .limit(batchSize + 1);

    process.stdout.write(".");

    if (entries.length <= batchSize) {
      hasMore = false;
    }

    offset += batchSize;
    total += entries.length - 1;

    try {
      await foodDataService.upsertRecordsToAlgolia(context, {
        ids: entries.map((e) => e.id),
      });
    } catch (error) {
      throw error;
    }
  }

  console.log("\nTotal foods uploaded: ", total);
}
