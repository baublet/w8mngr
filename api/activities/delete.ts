import { query } from "api/config/db";

export default async function deleteActivity(
  id: number,
  userId: number
): Promise<boolean> {
  const queryResult = await query({
    text: `
        UPDATE activities SET
          deleted = true
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `,
    values: [<number>id, <number>userId]
  });
  if (queryResult && queryResult.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}
