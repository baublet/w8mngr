import { Request } from "express";

import { TOKEN_EXPIRY_OFFSET } from "../dataServices/token/types";
import { log } from "../config/log";
import { Context } from "../createContext";
import { UserEntity, userDataService } from "../dataServices";

export async function authenticateRequest(
  request: Request,
  context: Context
): Promise<UserEntity | undefined> {
  const authenticationResult = await userDataService.authenticate(
    request,
    context
  );

  if (!authenticateRequest) {
    log("debug", "Unauthorized request");
    return;
  }

  log("debug", "Request authenticated", {
    authenticationResult,
  });

  return authenticationResult;
}
