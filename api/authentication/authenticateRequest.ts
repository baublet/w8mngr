import { Request } from "express";

import { log } from "../config/log";
import { Context } from "../createContext";
import { UserEntity, userDataService } from "../dataServices";
import { AuthenticationResult } from "../dataServices/user/authenticate";

export async function authenticateRequest(
  request: Request,
  context: Context
): Promise<AuthenticationResult | undefined> {
  const authenticationResult = await userDataService.authenticate(
    request,
    context
  );

  if (!authenticationResult) {
    log("debug", "Unauthorized request");
    return;
  }

  log("debug", "Request authenticated", {
    authenticationResult,
  });

  return authenticationResult;
}
