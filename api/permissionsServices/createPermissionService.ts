import { log } from "../config/log";
import { Context } from "../createContext";
import { errors } from "../helpers";

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
  materializeToPermissionsObject: (args: {
    [K in keyof T]?: Parameters<T[K]>;
  }) => Promise<Record<string, () => Promise<boolean>>>;
} {
  return {
    assert: async (permission, ...args) => {
      const value = await functions[permission].call(undefined, ...args);
      if (value instanceof Error) {
        throw value;
      }
    },
    materializeToPermissionsObject: async (args) => {
      const permissions = {} as Record<string, () => Promise<boolean>>;
      for (const permission in args) {
        const functionArgs: any[] = args[permission] || [];
        const permissionFunction = functions[permission];
        permissions[permission] = async () => {
          const value = await permissionFunction.call(
            undefined,
            // @ts-ignore -- :spin-think: not sure what gives
            ...functionArgs
          );
          if (value instanceof Error) {
            log("warn", "Permission function returned false", { value });
            return false;
          }
          return true;
        };
      }
      return permissions;
    },
  };
}

export function requireAuth(context: Context) {
  if (!context.getCurrentUser()) {
    throw new errors.Unauthorized(context);
  }
  return true as const;
}
