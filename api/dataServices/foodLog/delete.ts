import { Context } from "../../createContext";
import { query } from "./query";
import { assertIsTruthy } from "../../../shared/assertIsTruthy";

export async function deleteByIds(
  context: Context,
  ids: string[]
): Promise<void> {
  const userId = context.getCurrentUserId();
  assertIsTruthy(userId);
  await query(context, (q) => {
    q.delete().whereIn("id", ids).andWhere("userId", "=", userId);
    return q;
  });
}
