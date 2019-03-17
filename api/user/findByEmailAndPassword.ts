import { UserType } from "./types";
import { query } from "api/config/db";
import { compare } from "bcryptjs";

export default async function findUserByEmail(
  email: string,
  password: string
): Promise<UserType | false> {
  email = (<string>email).toLowerCase();

  const queryResult = await query({
    text: "SELECT * FROM users WHERE email = $1 LIMIT 1",
    values: [email]
  });

  if (
    queryResult.error ||
    !queryResult.result.rows ||
    !queryResult.result.rows.length
  ) {
    return false;
  } else {
    const passwordValid = await compare(
      password,
      queryResult.result.rows[0].password_digest
    );
    if (!passwordValid) {
      // Password isn't valid? User not found
      return false;
    } else {
      // User found and password valid, pass it along
      return queryResult.result.rows[0];
    }
  }
}
