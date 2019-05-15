import { query } from "api/config/db";

export default async function deleteMeasurement(
  id: number,
  foodId: number,
  userId: number
): Promise<boolean> {
  // First, select the foodId to be sure it's
  // owned by the user
  const initialQueryResult = await query({
    text: `
      SELECT * from foods WHERE id = $1 AND user_id = $2
      `,
    values: [<number>foodId, <number>userId]
  });

  if (!initialQueryResult.rowCount) {
    return false;
  }

  const queryResult = await query({
    text: `
      DELETE FROM measurements WHERE id = $1 AND food_id = $2
      `,
    values: [<number>id, <number>foodId]
  });
  if (queryResult && queryResult.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}
