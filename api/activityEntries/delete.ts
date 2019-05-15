import { query } from "api/config/db";

export default async function deleteActivityEntry(
  id: number,
  user_id: number
): Promise<boolean> {
  const queryResult = await query({
    text: "DELETE FROM activity_entries WHERE id = $1 AND user_id = $2",
    values: [<number>id, <number>user_id]
  });
  if (queryResult && queryResult.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}
