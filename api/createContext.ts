import { Request, Response } from "express";
import {
  ServiceContainer,
  createServiceContainer,
} from "@baublet/service-container";
import { ContextFunction } from "apollo-server-core";

import { log } from "./config/log";
import { UserEntity } from "./dataServices/user";
import { authenticateRequest } from "./authentication";

export interface Context {
  currentUser?: UserEntity;
  services: ServiceContainer;
  setCookie: (key: string, value: string | undefined) => void;
  getCookies: () => Map<string, string | undefined>;
  getResponse: () => Response | undefined;
  setResponse: (response: Response) => void;
}

export function createContext({
  currentUser,
  services = createServiceContainer(),
}: Partial<Context> = {}): Context {
  const cookiesToSet = new Map<string, string | undefined>();
  let contextResponse: Response;

  const context: Context = {
    currentUser,
    services,
    setCookie: (key: string, value: string | undefined) =>
      cookiesToSet.set(key, value),
    getCookies: () => cookiesToSet,
    setResponse: (response) => (contextResponse = response),
    getResponse: () => contextResponse,
  };
  return context;
}

export const createGraphqlContext: ContextFunction<
  {
    req: Request;
    res: Response;
  },
  Context
> = async ({ req, res }) => {
  const token = req.cookies?.w8mngr;

  const context = createContext();
  context.setResponse(res);
  log("info", "New request", {
    token,
    cookies: req.cookies,
    headers: req.headers,
  });

  const user = await authenticateRequest(req, context);
  context.currentUser = user;

  return context;
};
