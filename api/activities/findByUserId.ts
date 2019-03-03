import { ActivityType } from "./types";
import { DBResultType } from "../config/db";
import { query } from "../config/db";

export default async function readActivity(
  id: number
): Promise<Array<ActivityType>> {
  const queryResult = <DBResultType>await query({
    text: `
      SELECT *
        FROM activities
      WHERE user_id = $1::int
      `,
    values: [<number>id]
  });
  return queryResult.result.rows;
}
