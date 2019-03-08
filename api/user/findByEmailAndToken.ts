import { UserType } from "./types";

export default function findUserByEmail(
  email: string,
  token: string
): Promise<UserType | false> {
  return new Promise(async resolve => {
    email = (<string>email).toLowerCase();

    const { query } = require("../config/db"),
      queryResult = await query({
        text:
          "SELECT * FROM users WHERE email = $1 AND remember_digest = $2 LIMIT 1",
        values: [email, token]
      });

    if (
      queryResult.error ||
      !queryResult.result.rows ||
      !queryResult.result.rows.length
    ) {
      resolve(false);
    } else {
      resolve(queryResult.result.rows[0]);
    }
  });
}
