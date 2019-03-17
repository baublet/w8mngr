import { FoodType } from "./types";
import { query } from "api/config/db";

export default async function findUserByUserIdAndDays(
  userId: number,
  term: string,
  limit: number = 25,
  offset: number = 0
): Promise<Array<FoodType> | false> {
  const queryResult = await query({
    text: `SELECT
      f_search.user_id as user_id,
      f_search.id AS id,
      f_search.name AS name
      FROM (
      SELECT
        id,
        user_id,
        name,
        popularity, (
          to_tsvector('simple'::regconfig, coalesce(name, '')) ||
          to_tsvector('simple'::regconfig, coalesce(description, ''))
        ) AS document
      FROM
        foods) f_search
      WHERE
        f_search.document @@ to_tsquery($2) AND
        (user_id = 1 OR user_id = $1)
      ORDER BY f_search.popularity DESC
      LIMIT $3
      OFFSET $4`,
    values: [userId, term, limit, offset]
  });

  if (queryResult.result.rows && queryResult.result.rows.length) {
    return queryResult.result.rows;
  } else {
    return false;
  }
}
