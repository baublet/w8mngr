import { Context } from "../../context";
import { errors } from "../../helpers";
import { UserEntity } from "./types";
import { query } from "./query";

export async function findOneOrFail(
  context: Context,
  where: Partial<UserEntity>
): Promise<UserEntity> {
  const results = await query(context, (query) =>
    query.select("*").where(where).limit(1)
  );
  if (!results[0]) {
    throw new errors.NotFoundError("User not found", { where });
  }
  return results[0];
}
