import { userDataService } from "../../dataServices";
import { MutationResolvers } from "../../graphql-types";

export const loginWithToken: Required<MutationResolvers>["loginWithToken"] =
  async (parent, { input }, context) => {
    const login = await userDataService.loginWithToken(context, input);

    if (login instanceof Error) {
      throw login;
    }

    return login;
  };
