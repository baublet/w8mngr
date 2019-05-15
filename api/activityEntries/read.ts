import { ActivityEntryType } from "./types";
import { query } from "api/config/db";

export default async function readActivityEntry(
  id: number
): Promise<ActivityEntryType> {
  const queryResult = await query({
    text: `
      SELECT *
        FROM activity_entries
      WHERE id = $1
      `,
    values: [<number>id]
  });
  return queryResult.rows[0];
}
