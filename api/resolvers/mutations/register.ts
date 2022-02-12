import { userDataService } from "../../dataServices";
import { MutationResolvers } from "../../generated";

export const register: Required<MutationResolvers>["register"] = async (
  parent,
  { input },
  context
) => {
  const register = await userDataService.register(context, input);

  if (register instanceof Error) {
    throw register;
  }

  return register;
};
