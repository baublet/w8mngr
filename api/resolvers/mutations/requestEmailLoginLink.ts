import { log } from "../../config";
import {
  emailDataService,
  tokenDataService,
  userAccountDataService,
} from "../../dataServices";
import { MutationResolvers } from "../../graphql-types";

export const requestEmailLoginLink: MutationResolvers["requestEmailLoginLink"] =
  async (parent, args, context) => {
    const matchingAccount = await userAccountDataService.findOneBy(
      context,
      (q) =>
        q
          .andWhere("sourceIdentifier", "=", args.input.email)
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

    await emailDataService.create(context, {
      templateId: "emailLogin",
      toUserId: matchingAccount.userId,
      templateVariables: {
        loginToken: loginToken.token,
        user: context.getCurrentUser(true) as any,
      },
    });

    return {
      errors: [],
    };
  };
