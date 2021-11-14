import { Context } from "../../context";
import { UserEntity } from "./types";
import { query } from "./query";

export async function create(
  context: Context,
  user: Partial<UserEntity>
): Promise<UserEntity> {
  const inserted = await query(context, (query) => query.insert(user));
  return inserted[0];
}
