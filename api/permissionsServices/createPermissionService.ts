import { errors } from "api/helpers";

import { Context } from "../createContext";

type PermissionFunction = (
  context: Context,
  ...args: any[]
) => Promise<Error | true> | Error | true;

export function createPermissionService<
  T extends Record<string, PermissionFunction>
>(
  functions: T
): {
  assert: <TPermission extends keyof T>(
    permission: TPermission,
    ...args: Parameters<T[TPermission]>
  ) => Promise<void>;
} {
  return {
    assert: async (permission, ...args) => {
      const value = await functions[permission].call(undefined, ...args);
      if (value instanceof Error) {
        throw value;
      }
    },
  };
}

export function requireAuth(context: Context) {
  if (!context.currentUser) {
    throw new errors.Unauthorized(context);
  }
  return true as const;
}
