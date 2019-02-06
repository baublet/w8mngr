import { query } from "../config/db";
import { genSalt } from "bcryptjs";

export default async (userId: Number): Promise<String> => {
  return new Promise(async resolve => {
    const token = await genSalt(),
      queryResult = await query({
        text: "UPDATE users SET remember_digest = $1 WHERE id = $2",
        values: [token, userId]
      });
    resolve(token);
  });
};
