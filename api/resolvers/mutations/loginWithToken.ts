import { userDataService } from "../../dataServices/user";
import { MutationResolvers } from "../../generated";

export const loginWithToken: Required<MutationResolvers>["loginWithToken"] =
  async (parent, { input }, context) => {
    const login = await userDataService.loginWithToken(context, input);

    if (login instanceof Error) {
      throw login;
    }

    return login;
  };
