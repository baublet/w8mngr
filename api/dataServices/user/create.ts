import type { Context } from "../../createContext.js";
import type { UserEntity } from "./types.js";
import { rootService } from "./rootService.js";
import { assertIsTruthy } from "../../../shared/assertIsTruthy";
import { getUniqueId } from "../../../shared/getUniqueId";

export async function create(
  context: Context,
  user: Omit<Partial<UserEntity>, "id">
): Promise<UserEntity> {
  const results = await rootService.create(context, [
    {
      ...user,
      id: getUniqueId(),
    },
  ]);
  const result = results[0];
  assertIsTruthy(result, "Expected user create to return a record");
  return result;
}
