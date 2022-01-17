import { MutationResolvers } from "../../graphql-types";
import { tokenDataService, userAccountDataService } from "../../dataServices";
import { log } from "../../config";

export const verifyEmail: MutationResolvers["verifyEmail"] =
  async (parent, args, context) => {
    const token = await tokenDataService.findByToken(context, args.input.token);
    if (!token) {
      return {
        errors: ["Invalid token"],
      };
    }
    await tokenDataService.deleteByIds(context, [token.id]);
    await userAccountDataService.update(
      context,
      (q) => q.where("id", "=", token.userAccountId),
      { verified: true }
    );
    log("debug", "User account verified", {
      userAccountID: token.userAccountId,
    });
    return {
      errors: [],
    };
  };
