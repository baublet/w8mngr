import { UserType } from "./types";

export default async function findUserByEmail(
  email: string
): Promise<UserType | false> {
  email = (<string>email).toLowerCase();

  const { query } = require("../config/db"),
    queryResult = await query({
      text: "SELECT * FROM users WHERE email = $1 LIMIT 1",
      values: [email]
    });

  if (
    !queryResult.error &&
    queryResult.result.rows &&
    queryResult.result.rows.length
  ) {
    return queryResult.result.rows[0];
  } else {
    return false;
  }
}
