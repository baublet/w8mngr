import { ulid } from "ulid";

import { Context } from "../../createContext";
import { UserEntity } from "./types";
import { query } from "./query";
import { findOneOrFail } from "./findOneOrFail";

export async function create(
  context: Context,
  user: Omit<Partial<UserEntity>, "id">
): Promise<UserEntity> {
  const id = ulid();
  await query(context, (query) => {
    query.insert({
      ...user,
      id,
    });
    return query;
  });
  return findOneOrFail(context, (q) => q.where("id", "=", id));
}
