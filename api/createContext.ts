import fs from "fs";
import path from "path";

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
  getCurrentUser: <T extends boolean | undefined>(
    orThrow?: T
  ) => T extends false | undefined ? UserEntity : UserEntity | undefined;
  getCurrentUserId: (orThrow?: boolean) => string;
  currentUser?: UserEntity;
  setCurrentUser: (user?: UserEntity) => void;
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

  let currentUserRecord: UserEntity | undefined = Object.assign(
    {},
    currentUser
  );

  const context: Context = {
    currentUser: currentUserRecord,
    getClientId: () => clientId,
    getCookies: () => cookiesToSet,
    getRequest: () => contextRequest,
    getResponse: () => contextResponse,
    getCurrentUser: <T extends boolean | undefined>(orThrow?: T) => {
      const currentUser = currentUserRecord;
      if (!currentUser && orThrow) {
        throw new Error("Not logged in");
      }
      return currentUser as T extends false | undefined
        ? UserEntity
        : UserEntity | undefined;
    },
    getCurrentUserId: (orThrow?: boolean) => {
      const currentUserId = currentUserRecord?.id;
      if (!currentUserId && orThrow) {
        throw new Error("Not logged in");
      }
      return currentUserId || "robot";
    },
    setCurrentUser: (currentUser?: UserEntity) =>
      (currentUserRecord = currentUser),
    services,
    setCookie: (key, value, options) =>
      cookiesToSet.set(key, { value, options }),
    setRequest: (request) => (contextRequest = request),
    setResponse: (response) => (contextResponse = response),
    toJSON: () => ({ clientId }),
    toString: () => clientId,
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
  context.setCurrentUser(user);

  return context;
};
