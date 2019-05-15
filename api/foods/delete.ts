import { query } from "api/config/db";

export default async function deleteFood(
  id: number,
  userId: number
): Promise<boolean> {
  const queryResult = await query({
    text: "DELETE FROM foods WHERE id = $1 AND user_id = $2",
    values: [<number>id, <number>userId]
  });
  if (queryResult && queryResult.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}
