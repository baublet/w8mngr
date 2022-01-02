import knex from "knex";
import fs from "fs";
import path from "path";

const db = knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./dev.legacyData.sqlite3",
  },
});
const getDb = () => db;

const dumpsPath = path.resolve(process.cwd(), "dumps");
const dumps = ["activity", "food", "activityEntry", "foodEntry", "measurement"] as const;

(async () => {
  for (const dump of dumps) {
    console.log(`Importing ${dump}...`);
    await runDump(dump);
  }
  console.log("Done")
  process.exit(0);
})();

async function runDump(dump: typeof dumps[number]) {
  const rawDumps = getDump(dump).split(";\n");
  let dumpNumber = 1;
  const totalDumps = rawDumps.length;
  for (const dump of rawDumps) {
    await tryUntilDone(dump);
    dumpNumber++;
    if (dumpNumber % 100 === 0) {
      console.log(dumpNumber++ + " of " + totalDumps);
    }
  }
}

async function tryUntilDone(dump: string, maxTries: number = 3) {
  if (!dump.trim()) {
    return;
  }
  let lastError;
  const db = getDb();
  for (let i = 0; i < maxTries; i++) {
    try {
      await db.raw(dump);
    } catch (e) {
      lastError = e;
      await wait(3000);
      continue;
    }
    return;
  }
  throw lastError;
}

function getDump(dump: typeof dumps[number]): string {
  return fs.readFileSync(path.resolve(dumpsPath, dump)).toString();
}

async function wait(ms: number = 1000) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
