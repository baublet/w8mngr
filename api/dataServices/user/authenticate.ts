import { Context } from "../../createContext.js";
import { InsertableDatabaseRecord, Database } from "../../config/db.js";
import { tokenDataService } from "../token/index.js";
import { userDataService } from "./index.js";
import { userAccountDataService } from "../userAccount/index.js";
import { TOKEN_EXPIRY_OFFSET } from "../token/types.js";

export type AuthenticationResult = {
  user: InsertableDatabaseRecord<Database["user"]>;
  userAccount: InsertableDatabaseRecord<Database["userAccount"]>;
};

export async function authenticate({
  context,
  authToken,
  rememberToken,
}: {
  authToken?: string;
  rememberToken?: string;
  context: Context;
}): Promise<AuthenticationResult | undefined> {
  // return globalInMemoryCache.getOrSet({
  //   key: "authentication-" + authToken + "-" + rememberToken,
  //   expiry: Date.now() + 1000 * 60, // 1 minute
  //   fn: async () => {
  if (authToken) {
    const tokenEntity = await tokenDataService.findByToken(context, authToken);
    if (tokenEntity) {
      const userAccount = await userAccountDataService.findOneOrFail(
        context,
        tokenEntity.userAccountId,
      );
      const user = await userDataService.findOneOrFail(
        context,
        userAccount.userId,
      );
      return {
        user,
        userAccount,
      };
    }
  }

  if (rememberToken) {
    const tokenEntity = await tokenDataService.findByToken(
      context,
      rememberToken,
    );
    if (tokenEntity) {
      // Make a new auth token to set
      const newAuthTokenResult = await tokenDataService.getOrCreate(context, {
        type: "auth",
        userAccountId: tokenEntity.userAccountId,
      });

      context.setCookie("w8mngrAuth", newAuthTokenResult.token, {
        expires: new Date(Date.now() + TOKEN_EXPIRY_OFFSET.auth),
      });

      const userAccount = await userAccountDataService.findOneOrFail(
        context,
        tokenEntity.userAccountId,
      );
      const user = await userDataService.findOneOrFail(
        context,
        userAccount.userId,
      );

      return {
        user,
        userAccount,
      };
    }
  }
  //   },
  // });
}
