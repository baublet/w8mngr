import { Context } from "../../createContext.js";
import type { UserAccountEntity } from "./types.js";
import { rootService } from "./rootService.js";
import { assertIsTruthy } from "../../../shared/assertIsTruthy.js";
import { getUniqueId } from "../../../shared/getUniqueId.js";

export async function create(
  context: Context,
  userAccount: Partial<UserAccountEntity> = {}
): Promise<UserAccountEntity> {
  const id = getUniqueId();
  const normalizedUserAccountData: Pick<
    UserAccountEntity,
    "id" | "source" | "userId"
  > = {
    id,
    source: "local" as const,
    userId: "temporary",
    ...userAccount,
  };
  const results = await rootService.create(context, [
    normalizedUserAccountData,
  ]);
  const result = results[0];
  assertIsTruthy(result, "Expected user account to be truthy");
  return result;
}
