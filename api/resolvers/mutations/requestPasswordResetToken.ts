import { getRoundedDate } from "../../../shared/getRoundedDate";
import { log } from "../../config/log";
import { emailDataService } from "../../dataServices/email";
import { tokenDataService } from "../../dataServices/token";
import { userAccountDataService } from "../../dataServices/userAccount";
import { MutationResolvers } from "../../generated";

export const requestPasswordResetToken: MutationResolvers["requestPasswordResetToken"] =
  async (parent, args, context) => {
    const matchingAccount = await userAccountDataService.findOneBy(
      context,
      (q) =>
        q
          .where("source", "=", "local")
          .where("sourceIdentifier", "=", args.input.email)
    );

    if (!matchingAccount) {
      log("warn", "Request password reset token tried with invalid email", {
        args,
      });
      return {
        errors: [],
      };
    }

    // Only allows a person to request a password reset token once every 10 minutes
    const idempotenceKey =
      args.input.email +
      "-reset-password-link-" +
      getRoundedDate({
        interval: "minutes",
        intervalAmount: 10,
      }).toISOString();

    const extantEmail = await emailDataService.findOneBy(context, (q) =>
      q.where("idempotenceKey", "=", idempotenceKey)
    );

    if (extantEmail) {
      return {
        errors: [
          "You have already requested a reset token for this email address. Please check your email for the link.",
        ],
      };
    }

    const resetToken = await tokenDataService.getOrCreate(context, {
      type: "passwordReset",
      userAccountId: matchingAccount.id,
    });

    await emailDataService.create(context, {
      templateId: "forgotPassword",
      toUserId: matchingAccount.userId,
      idempotenceKey,
      templateVariables: {
        resetToken: resetToken.token,
        user: context.getCurrentUser(true) as any,
      },
    });

    return {
      errors: [],
    };
  };
