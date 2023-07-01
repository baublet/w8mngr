import { log } from "../../config/log";
import { userDataService } from "../../dataServices/user";
import { MutationResolvers } from "../../generated";

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
    log("error", "Error resetting password", { result });
    return {
      errors: [result.message],
    };
  }

  return {
    currentUser: result.user,
    errors: [],
  };
};
