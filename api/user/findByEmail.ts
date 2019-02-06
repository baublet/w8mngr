import { UserType } from "./types";

export default function findUserByEmail(
  email: String
): Promise<UserType | false> {
  return new Promise(async (resolve, reject) => {
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
      resolve(queryResult.result.rows[0]);
    } else {
      resolve(false);
    }
  });
}
