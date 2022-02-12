import { userDataService } from "../../dataServices";
import { MutationResolvers } from "../../generated";

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
