import { Request, Response } from "express";
import {
  ServiceContainer,
  createServiceContainer,
} from "@baublet/service-container";
import { ContextFunction } from "apollo-server-core";

import { log } from "./config/log";
import { UserEntity } from "./dataServices/user";
import { authenticateRequest } from "./authentication";
import { getClientId } from "./helpers";

export interface Context {
  getClientId: () => string;
  currentUser?: UserEntity;
  services: ServiceContainer;
  setCookie: (
    key: string,
    value: string | undefined,
    options?: {
      expires?: Date;
    }
  ) => void;
  getCookies: () => Map<string, { value: string | undefined; options: any }>;
  getResponse: () => Response | undefined;
  setResponse: (response: Response) => void;
  getRequest: () => Request | undefined;
  setRequest: (request: Request) => void;
  toString: () => string;
  toJSON: () => any;
}

export function createContext(
  {
    clientId,
    currentUser,
    services = createServiceContainer(),
  }: Partial<Context> & { clientId: string } = {
    clientId: "no-client-hash-set",
  }
): Context {
  const cookiesToSet = new Map<
    string,
    { value: string | undefined; options: any }
  >();
  let contextResponse: Response;
  let contextRequest: Request;

  const context: Context = {
    getClientId: () => clientId,
    currentUser,
    services,
    setCookie: (key, value, options) =>
      cookiesToSet.set(key, { value, options }),
    getCookies: () => cookiesToSet,
    setResponse: (response) => (contextResponse = response),
    getResponse: () => contextResponse,
    setRequest: (request) => (contextRequest = request),
    getRequest: () => contextRequest,
    toString: () => clientId,
    toJSON: () => ({ clientId }),
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
  const clientId = getClientId(req, res);

  const context = createContext({
    clientId,
  });

  context.setResponse(res);
  context.setRequest(req);

  log("debug", "New request", {
    token,
    clientId,
    cookies: req.cookies,
    headers: req.headers,
  });

  const user = await authenticateRequest(req, context);
  context.currentUser = user;

  return context;
};
