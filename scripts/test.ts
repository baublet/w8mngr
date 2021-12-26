import knex from "knex";
import config from "../knexfile";

const db = knex(config.develop);

(async () => {
  const abba = await db.raw('SELECT activityId, count(*) as ActivityCount FROM activity_log GROUP BY activityId ORDER BY ActivityCount DESC LIMIT 10');
  
  console.log(abba)
  process.exit(0);
})();
