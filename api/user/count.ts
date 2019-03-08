export default function countUsers(): Promise<number> {
  return new Promise(async resolve => {
    const { query } = require("../config/db"),
      queryResult = await query({ text: "SELECT COUNT(id) AS cnt FROM users" });

    resolve(parseInt(queryResult.result.rows[0].cnt, 10));
  });
}
