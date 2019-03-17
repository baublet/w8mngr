import { query } from "api/config/db";

export default async function countUsers(): Promise<number> {
  const { query } = require("../config/db"),
    queryResult = await query({ text: "SELECT COUNT(id) AS cnt FROM users" });

  return parseInt(queryResult.result.rows[0].cnt, 10);
}
