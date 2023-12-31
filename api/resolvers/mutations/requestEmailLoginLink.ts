import { getRoundedDate } from "../../../shared/getRoundedDate";
import { log } from "../../config/log";
import { emailDataService } from "../../dataServices/email";
import { tokenDataService } from "../../dataServices/token";
import { userAccountDataService } from "../../dataServices/userAccount";
import { MutationResolvers } from "../../generated";

export const requestEmailLoginLink: MutationResolvers["requestEmailLoginLink"] =
  async (parent, args, context) => {
    const matchingAccount = await userAccountDataService.findOneBy(
      context,
      (q) => q.where("sourceIdentifier", "=", args.input.email)
    );

    if (!matchingAccount) {
      log("warn", "Request email login token tried with invalid email", {
        args,
      });
      return {
        errors: [],
      };
    }

    const loginToken = await tokenDataService.getOrCreate(context, {
      type: "emailLogin",
      userAccountId: matchingAccount.id,
    });

    // Only allows a person to request an email login link once every 10 minutes
    const idempotenceKey =
      args.input.email +
      "-magic-email-link-" +
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
          "You have already requested a login link for this email address. Please check your email for the link.",
        ],
      };
    }

    await emailDataService.create(context, {
      templateId: "emailLogin",
      toUserId: matchingAccount.userId,
      templateVariables: {
        loginToken: loginToken.token,
        user: context.getCurrentUser(true) as any,
      },
      idempotenceKey,
    });

    return {
      errors: [],
    };
  };
