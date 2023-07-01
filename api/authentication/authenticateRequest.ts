import { Request } from "@cloudflare/workers-types";

import { Context, createContext } from "../createContext";
import { getClientId } from "../helpers/getClientId";
import { userDataService, UserEntity } from "../dataServices/user";
import type { UserAccountEntity } from "../dataServices/userAccount";

export async function authenticateRequest({
  request,
}: {
  request: Request;
}): Promise<{
  context: Context;
  authToken?: string;
  rememberToken?: string;
  clientId: string;
  user?: UserEntity;
  userAccount?: UserAccountEntity;
}> {
  const clientId = getClientId(request);
  const context = createContext({
    clientId,
  });

  const authToken: string | undefined = (request.headers
    .get("authorization")
    ?.split(" ") || [])[1];
  const rememberToken = request.headers.get("remember-token") || undefined;
  context.setAuthTokens(authToken, rememberToken);

  if (!authToken && !rememberToken) {
    return {
      context,
      authToken,
      rememberToken,
      clientId,
    };
  }

  const authResult = await userDataService.authenticate({
    authToken,
    rememberToken,
    context: context,
  });

  if (!authResult) {
    return {
      context,
      authToken,
      rememberToken,
      clientId,
    };
  }

  context.setCurrentUser(authResult.user);
  context.setCurrentUserAccount(authResult.userAccount);

  return {
    context,
    authToken,
    rememberToken,
    clientId,
    user: authResult.user,
    userAccount: authResult.userAccount,
  };
}
