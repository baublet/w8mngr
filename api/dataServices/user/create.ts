import { ulid } from "ulid";

import { Context } from "../../createContext";
import { userDataService } from "./";
import { getQuery } from "./query";
import { UserEntity } from "./types";

export async function create(
  context: Context,
  user: Omit<Partial<UserEntity>, "id">
): Promise<UserEntity> {
  const id = ulid();
  const queryFactory = await getQuery(context);
  await queryFactory().insert({
    ...user,
    id,
  });
  return userDataService.findOneOrFail(context, (q) => q.where("id", "=", id));
}
