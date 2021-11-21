import { userDataService } from "../../dataServices";
import { MutationResolvers } from "../../graphql-types";

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
