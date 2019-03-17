import findByEmail from "./findByEmail";
import { hash } from "bcryptjs";
import { query } from "api/config/db";
import { UserType } from "./types";

export default async function createUser(
  email: string,
  password: string
): Promise<UserType> {
  email = (<string>email).toLowerCase();
  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new Error(`This email address (${email}) is already registered.`);
  }
  const password_digest = await hash(password, 10),
    queryResult = await query({
      text:
        "INSERT INTO users (email, password_digest, created_at, updated_at) VALUES ($1, $2, now(), now()) RETURNING *",
      values: [email, password_digest]
    });
  // New user ID will be result.rows[0].id
  return queryResult.result.rows[0];
}
