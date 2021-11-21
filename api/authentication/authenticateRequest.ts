import { Request } from "express";

import { log } from "../config/log";
import { Context } from "../createContext";
import {
  UserEntity,
  userDataService,
  userAccountDataService,
} from "../dataServices";

export async function authenticateRequest(
  request: Request,
  context: Context
): Promise<UserEntity | undefined> {
  const cookie = request.cookies?.w8mngr;

  if (cookie) {
    try {
      const account = await userAccountDataService.findOneOrFail(context, (q) =>
        q.where("tokenDigest", "=", cookie)
      );
      return userDataService.findOneOrFail(context, (q) =>
        q.where("id", "=", account.userId)
      );
    } catch (error: any) {
      log("warn", "Authorization rejected", {
        cookies: request.cookies,
        message: error?.message,
        trace: error?.stack,
      });
    }
  }
  log("info", "Unauthorized request");
}
