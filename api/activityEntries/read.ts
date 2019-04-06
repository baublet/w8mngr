import { ActivityEntryType } from "./types";
import { DBResultType } from "api/config/db";
import { query } from "api/config/db";

export default async function readActivityEntry(
  id: number
): Promise<ActivityEntryType> {
  const queryResult = <DBResultType>await query({
    text: `
      SELECT *
        FROM activity_entries
      WHERE id = $1
      `,
    values: [<number>id]
  });
  return queryResult.result.rows[0];
}
