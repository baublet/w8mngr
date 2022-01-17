import { Request } from "express";

import { Context } from "../../createContext";
import { UserEntity } from "./types";
import { tokenDataService } from "../token";
import { userDataService } from "./";
import { userAccountDataService, UserAccountEntity } from "../userAccount";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { globalInMemoryCache } from "../../helpers";

export type AuthenticationResult = {
  user: UserEntity;
  userAccount: UserAccountEntity;
};

export async function authenticate(
  request: Request,
  context: Context
): Promise<AuthenticationResult | undefined> {
  const authToken: string | undefined = request.cookies?.w8mngrAuth;
  const rememberToken: string | undefined = request.cookies?.w8mngrRemember;
  return globalInMemoryCache.getOrSet({
    key: "authentication-" + authToken + "-" + rememberToken,
    expiry: Date.now() + 1000 * 60, // 1 minute
    fn: async () => {
      if (authToken) {
        const tokenEntity = await tokenDataService.findByToken(
          context,
          authToken
        );
        if (tokenEntity) {
          const userAccount = await userAccountDataService.findOneOrFail(
            context,
            (q) => q.where("id", "=", tokenEntity.userAccountId)
          );
          const user = await userDataService.findOneOrFail(context, (q) =>
            q.where("id", "=", userAccount.userId)
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
          rememberToken
        );
        if (tokenEntity) {
          // Make a new auth token to set
          const newAuthTokenResult = await tokenDataService.getOrCreate(
            context,
            {
              type: "auth",
              userAccountId: tokenEntity.userAccountId,
            }
          );

          context.setCookie("w8mngrAuth", newAuthTokenResult.token, {
            expires: new Date(Date.now() + TOKEN_EXPIRY_OFFSET.auth),
          });

          const userAccount = await userAccountDataService.findOneOrFail(
            context,
            (q) => q.where("id", "=", tokenEntity.userAccountId)
          );
          const user = await userDataService.findOneOrFail(context, (q) =>
            q.where("id", "=", userAccount.userId)
          );

          return {
            user,
            userAccount,
          };
        }
      }
    },
  });
}
