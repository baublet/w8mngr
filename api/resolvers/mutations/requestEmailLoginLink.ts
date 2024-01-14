import { getRoundedDate } from "../../../shared/getRoundedDate.js";
import { configService } from "../../config/config.js";
import { log } from "../../config/log.js";
import { emailDataService } from "../../dataServices/email/index.js";
import { tokenDataService } from "../../dataServices/token/index.js";
import { userAccountDataService } from "../../dataServices/userAccount/index.js";
import { MutationResolvers } from "../../generated.js";

export const requestEmailLoginLink: MutationResolvers["requestEmailLoginLink"] =
  async (parent, args, context) => {
    const matchingAccount = await userAccountDataService.findOneBy(
      context,
      (q) => q.where("sourceIdentifier", "=", args.input.email),
    );

    if (!matchingAccount) {
      log(
        context,
        "warn",
        "Request email login token tried with invalid email",
        {
          args,
        },
      );
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
      q.where("idempotenceKey", "=", idempotenceKey),
    );

    if (extantEmail) {
      return {
        errors: [
          "You have already requested a login link for this email address. Please check your email for the link.",
        ],
      };
    }

    const link = `${context.services
      .get(configService)
      .get("PUBLIC_URL")}/logging-in?loginToken=${loginToken.token}`;

    await emailDataService.create(context, {
      templateId: "emailLogin",
      toUserId: matchingAccount.userId,
      templateVariables: {
        user: context.getCurrentUser(true) as any,
        link,
      },
      idempotenceKey,
    });

    if (
      context.services
        .get(configService)
        .get("DANGEROUSLY_LOG_EMAIL_LOGIN_LINKS") === "true"
    ) {
      log(context, "debug", "\n\nEmail login link: " + link + "\n\n");
    }

    return {
      errors: [],
    };
  };
