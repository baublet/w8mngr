import { Context } from "../../createContext";
import { errors } from "../../helpers";
import { UserEntity } from "./types";
import { query, UserQueryBuilder } from "./query";

export async function findOneOrFail(
  context: Context,
  where: (whereQuery: UserQueryBuilder) => Promise<void> | void
): Promise<UserEntity> {
  const results = await query(context, async (query) => {
    query.select("*");
    await where(query);
    query.limit(1);
    return query;
  });
  if (!results[0]) {
    throw new errors.NotFoundError("UserEntity.findOneOrFail: user not found");
  }
  return results[0];
}
