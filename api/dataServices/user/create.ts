import { ulid } from "ulid";

import type { Context } from "../../createContext";
import type { UserEntity } from "./types";
import { rootService } from "./rootService";
import { assertIsTruthy } from "../../../shared";

export async function create(
  context: Context,
  user: Omit<Partial<UserEntity>, "id">
): Promise<UserEntity> {
  const results = await rootService.create(context, [user]);
  const result = results[0];
  assertIsTruthy(result, "Expected user create to return a record");
  return result;
}
