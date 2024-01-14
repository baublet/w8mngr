import { userDataService } from "../../dataServices/user/index.js";
import { MutationResolvers } from "../../generated.js";

export const register: Required<MutationResolvers>["register"] = async (
  parent,
  { input },
  context,
) => {
  console.log("Made it here");
  const register = await userDataService.register(context, input);

  if (register instanceof Error) {
    throw register;
  }

  return register;
};
