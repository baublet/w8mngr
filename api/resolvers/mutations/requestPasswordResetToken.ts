import { log } from "../../config/log";
import {
  emailDataService,
  tokenDataService,
  userAccountDataService,
} from "../../dataServices";
import { MutationResolvers } from "../../generated";

export const requestPasswordResetToken: MutationResolvers["requestPasswordResetToken"] =
  async (parent, args, context) => {
    const matchingAccount = await userAccountDataService.findOneBy(
      context,
      (q) =>
        q
          .where("source", "=", "local")
          .andWhere("sourceIdentifier", "=", args.input.email)
    );

    if (!matchingAccount) {
      log("warn", "Request password reset token tried with invalid email", {
        args,
      });
      return {
        errors: [],
      };
    }

    const resetToken = await tokenDataService.getOrCreate(context, {
      type: "passwordReset",
      userAccountId: matchingAccount.id,
    });

    await emailDataService.create(context, {
      templateId: "forgotPassword",
      toUserId: matchingAccount.userId,
      templateVariables: {
        resetToken: resetToken.token,
        user: context.getCurrentUser(true) as any,
      },
    });

    return {
      errors: [],
    };
  };
