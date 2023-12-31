import { ServiceContainer } from "@baublet/service-container";

import { Context, createContext } from "../createContext.js";
import { getClientId } from "../helpers/getClientId.js";
import { userDataService, UserEntity } from "../dataServices/user/index.js";
import type { UserAccountEntity } from "../dataServices/userAccount/index.js";

declare global {
  interface Request {
    services: ServiceContainer;
  }
}

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
    services: request.services,
  });

  const rawCookies = request.headers.get("Cookie");
  const cookies = rawCookies?.split(";").map((c) => c.trim()) || [];
  const cookieMap = cookies.reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const authToken =
    cookieMap["w8mngrAuth"] ||
    (request.headers.get("Authorization")?.split(" ") || [])[1] ||
    request.headers.get("Authorization") ||
    undefined;

  const rememberToken =
    cookieMap["w8mngrRemember"] ||
    request.headers.get("Remember-Token") ||
    undefined;

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
