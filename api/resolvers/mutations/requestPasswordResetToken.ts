import { getRoundedDate } from "../../../shared/getRoundedDate.js";
import { configService } from "../../config/config.js";
import { log } from "../../config/log.js";
import { emailDataService } from "../../dataServices/email/index.js";
import { tokenDataService } from "../../dataServices/token/index.js";
import { userAccountDataService } from "../../dataServices/userAccount/index.js";
import { MutationResolvers } from "../../generated.js";

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
      log(
        context,
        "warn",
        "Request password reset token tried with invalid email",
        {
          args,
        }
      );
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
        link: `${context.services
          .get(configService)
          .get("PUBLIC_URL")}/reset-password/${resetToken}`,
        user: context.getCurrentUser(true),
      },
    });

    return {
      errors: [],
    };
  };
