import { log } from "../../config/log.js";
import { userDataService } from "../../dataServices/user/index.js";
import { MutationResolvers } from "../../generated.js";

export const resetPassword: MutationResolvers["resetPassword"] = async (
  parent,
  args,
  context
) => {
  const result = await userDataService.resetPassword(context, {
    password: args.input.password,
    passwordConfirmation: args.input.passwordConfirmation,
    passwordResetToken: args.input.resetToken,
  });

  if (result instanceof Error) {
    log(context, "error", "Error resetting password", { result });
    return {
      errors: [result.message],
    };
  }

  return {
    currentUser: result.user,
    errors: [],
  };
};
