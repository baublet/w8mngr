import { userDataService } from "../../dataServices/user";
import { MutationResolvers } from "../../generated";

export const login: Required<MutationResolvers>["login"] = async (
  parent,
  { input },
  context
) => {
  const login = await userDataService.login(context, input);

  if (login instanceof Error) {
    throw login;
  }

  return login;
};
