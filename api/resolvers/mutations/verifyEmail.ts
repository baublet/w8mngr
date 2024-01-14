import { log } from "../../config/log.js";
import { tokenDataService } from "../../dataServices/token/index.js";
import { userAccountDataService } from "../../dataServices/userAccount/index.js";
import { MutationResolvers } from "../../generated.js";

export const verifyEmail: MutationResolvers["verifyEmail"] = async (
  parent,
  args,
  context,
) => {
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
    { verified: 1 },
  );
  log(context, "debug", "User account verified", {
    userAccountID: token.userAccountId,
  });
  return {
    errors: [],
  };
};
