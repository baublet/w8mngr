import { userDataService } from "../../dataServices/user/index.js";
import { MutationResolvers } from "../../generated.js";

export const loginWithToken: Required<MutationResolvers>["loginWithToken"] =
  async (parent, { input }, context) => {
    const login = await userDataService.loginWithToken(context, input);

    if (login instanceof Error) {
      throw login;
    }

    return login;
  };
