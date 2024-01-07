import { assertIsError } from "../../shared/assertIsError.js";
import { log } from "../config/log.js";
import { QueryResolvers } from "../generated.js";

export const currentUser: Required<QueryResolvers>["currentUser"] = (
  parent,
  args,
  context
) => {
  try {
    const user = context.getCurrentUser(true);
    const userAccount = context.getCurrentUserAccount(true);
    return {
      ...user,
      verified: Boolean(userAccount.verified),
      preferredName:
        user.preferredName || userAccount.sourceIdentifier || undefined,
    };
  } catch (error) {
    assertIsError(error);
    log(context, "error", "Error getting current user", { error });
  }
};
