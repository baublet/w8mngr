import { ulid } from "ulid";

import { Context } from "../../createContext";
import type { UserAccountEntity } from "./types";
import { rootService } from "./rootService";
import { assertIsTruthy } from "../../../shared";

export async function create(
  context: Context,
  userAccount: Partial<UserAccountEntity> = {}
): Promise<UserAccountEntity> {
  const id = ulid();
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
