import knex from "knex";
import fs from "fs";
import path from "path";

import config from "../knexfile";

const database = process.env.DATABASE || "develop";

const db = knex((config as any)[database]);

const dumpsPath = path.resolve(process.cwd(), "dumps");
const dumps = ["food"] as const;

function getDump(dump: typeof dumps[number]): string {
  return fs.readFileSync(path.resolve(dumpsPath, dump)).toString();
}

(async () => {
  for (const dump of dumps) {
    console.log(`Importing ${dump}...`);
    await db.raw(getDump(dump));
  }

  await db.destroy();
})();
