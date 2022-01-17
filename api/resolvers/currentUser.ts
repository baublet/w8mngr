import { assertIsError } from "../../shared";
import { QueryResolvers } from "../graphql-types";
import { log } from "../config";

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
      verified: userAccount.verified,
    };
  } catch (error) {
    assertIsError(error);
    log("error", "Error getting current user", { error });
  }
};
