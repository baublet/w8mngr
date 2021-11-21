import { Request } from "express";

import { Context } from "../../createContext";
import { UserEntity } from "./types";
import { tokenDataService } from "../token";
import { findOneOrFail } from "./findOneOrFail";
import { userAccountDataService } from "../userAccount";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { globalInMemoryCache } from "../../helpers";

export async function authenticate(
  request: Request,
  context: Context
): Promise<UserEntity | undefined> {
  const authToken = request.cookies?.w8mngrAuth;
  const rememberToken = request.cookies?.w8mngrRemember;
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
          const account = await userAccountDataService.findOneOrFail(
            context,
            (q) => q.where("id", "=", tokenEntity.userAccountId)
          );
          return findOneOrFail(context, (q) =>
            q.where("id", "=", account.userId)
          );
        }
      }

      if (rememberToken) {
        const tokenEntity = await tokenDataService.findByToken(
          context,
          authToken
        );
        if (tokenEntity) {
          // Make a new auth token and pass it back
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

          const account = await userAccountDataService.findOneOrFail(
            context,
            (q) => q.where("id", "=", tokenEntity.userAccountId)
          );
          return findOneOrFail(context, (q) =>
            q.where("id", "=", account.userId)
          );
        }
      }
    },
  });
}
