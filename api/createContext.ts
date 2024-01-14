import {
  ServiceContainer,
  createServiceContainer,
} from "@baublet/service-container";

import type { UserAccountEntity } from "./dataServices/userAccount/index.js";
import type { UserEntity } from "./dataServices/user/index.js";

export interface Context {
  destroy: () => Promise<void>;
  getClientId: () => string;
  getCurrentUser: <T extends boolean | undefined>(
    orThrow?: T,
  ) => T extends false | undefined ? UserEntity | undefined : UserEntity;
  getCurrentUserId: <T extends boolean>(
    orThrow?: T,
  ) => T extends false ? string | undefined : string;
  getCurrentUserAccountId: <T extends boolean | undefined>(
    orThrow?: T,
  ) => T extends false | undefined ? string | undefined : string;
  setCurrentUserAccount: (userAccountId: UserAccountEntity) => void;
  getCurrentUserAccount: <T extends boolean | undefined>(
    orThrow?: T,
  ) => T extends false | undefined
    ? UserAccountEntity | undefined
    : UserAccountEntity;
  setCurrentUser: (user?: UserEntity) => void;
  services: ServiceContainer;
  setCookie: (
    key: string,
    value: string | undefined,
    options?: {
      expires?: Date;
    },
  ) => void;
  getCookies: () => Map<string, { value: string | undefined; options: any }>;
  toString: () => string;
  toJSON: () => any;
  setAuthTokens: (authToken?: string, rememberToken?: string) => void;
  getAuthTokens: () => { authToken?: string; rememberToken?: string };
}

export function createContext({
  clientId,
  currentUser,
  services = createServiceContainer(),
  currentUserAccount,
}: Partial<Context> & {
  clientId: string;
  currentUser?: UserEntity;
  currentUserAccount?: UserAccountEntity;
}): Context {
  const cookiesToSet = new Map<
    string,
    { value: string | undefined; options: any }
  >();
  let currentUserRecord: UserEntity | undefined = Object.assign(
    {},
    currentUser,
  );
  let userAccount = currentUserAccount;
  let authTokens: {
    authToken?: string;
    rememberToken?: string;
  } = {
    authToken: undefined,
    rememberToken: undefined,
  };

  const context: Context = {
    getAuthTokens: () => authTokens,
    setAuthTokens: (authToken?: string, rememberToken?: string) => {
      authTokens = {
        authToken,
        rememberToken,
      };
    },
    destroy: async () => {
      const serviceArray = services.getAll();
      await Promise.all(
        serviceArray.map(async ({ service, factory }) => {
          if (factory === contextService) {
            // Don't let the context factory destroy itself (this creates an infinite loop!)
            return;
          }
          const resolvedService = await service;
          if (isServiceWithDestroyFunction(resolvedService)) {
            return resolvedService.destroy();
          }
        }),
      );
    },
    getCurrentUserAccountId: (orThrow?: boolean) => {
      if (orThrow && !userAccount) {
        throw new Error("No current user account set");
      }
      return userAccount?.id || "robot";
    },
    getCurrentUserAccount: <T extends boolean | undefined>(orThrow?: T) => {
      const currentUserAccount = userAccount;
      if (!currentUserAccount && orThrow) {
        throw new Error("Not logged in");
      }
      return currentUserAccount as T extends false | undefined
        ? UserAccountEntity | undefined
        : UserAccountEntity;
    },
    setCurrentUserAccount: (newUserAccount?: UserAccountEntity) =>
      (userAccount = newUserAccount),
    getClientId: () => clientId,
    getCookies: () => cookiesToSet,
    getCurrentUser: <T extends boolean | undefined>(orThrow?: T) => {
      const currentUser = currentUserRecord;
      if (!currentUser && orThrow) {
        throw new Error("Not logged in");
      }
      return currentUser as T extends false | undefined
        ? UserEntity | undefined
        : UserEntity;
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
    toJSON: () => ({ clientId }),
    toString: () => clientId,
  };

  services.set(contextService, context);

  return context;
}

export function contextService(serviceContainer: ServiceContainer): Context {
  if (serviceContainer.has(contextService)) {
    return serviceContainer.get(contextService);
  }
  throw new Error("Context service container not properly initialized!");
}

function isServiceWithDestroyFunction(
  value: unknown,
): value is { destroy: () => Promise<void> } {
  if (typeof value !== "object") {
    return false;
  }

  const anyValue: any = value;
  if (typeof anyValue.destroy !== "function") {
    return false;
  }

  return true;
}
