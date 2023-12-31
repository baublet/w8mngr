import { userDataService } from "../../dataServices/user/index.js";
import { MutationResolvers } from "../../generated.js";

export const logout: Required<MutationResolvers>["logout"] = async (
  parent,
  unknown,
  context
) => {
  const result = await userDataService.logout(context);

  if (result instanceof Error) {
    throw result;
  }

  return {
    expiredTokens: result,
  };
};
