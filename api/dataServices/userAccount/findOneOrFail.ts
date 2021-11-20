import { Context } from "../../createContext";
import { UserAccountEntity } from "./types";
import { query, UserAccountQueryBuilder } from "./query";
import { errors } from "../../helpers";

export async function findOneOrFail(
  context: Context,
  where: (whereQuery: UserAccountQueryBuilder) => Promise<void> | void
): Promise<UserAccountEntity> {
  const found = await query(context, async (query) => {
    query.select("*");
    await where(query);
    return query.limit(1);
  });

  const foundItem = found[0];

  if (!foundItem) {
    throw new errors.NotFoundError(
      "UserAccountEntity.findOneOrFail: user account not found"
    );
  }

  return foundItem;
}
