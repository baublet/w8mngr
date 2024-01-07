import { ServiceContainer } from "@baublet/service-container";

import { log } from "../config/log.js";
import { Context, contextService } from "../createContext.js";
import { Unauthorized } from "../helpers/errors/Unauthorized.js";

type PermissionFunction = (
  context: Context,
  ...args: any[]
) => Promise<Error | true> | Error | true;

type ArgsWithoutContext<T> = T extends [Context, ...infer R] ? R : never;

export function createPermissionService<
  T extends Record<string, PermissionFunction>
>(
  functions: T
): (services: ServiceContainer) => {
  assert: <TPermission extends keyof T>(
    permission: TPermission,
    ...args: ArgsWithoutContext<Parameters<T[TPermission]>>
  ) => Promise<void>;
  materializeToPermissionsObject: (args: {
    [K in keyof T]?: ArgsWithoutContext<Parameters<T[K]>>;
  }) => Promise<Record<string, () => Promise<boolean>>>;
} {
  return (services) => {
    const context = services.get(contextService);
    return {
      assert: async (permission, ...args) => {
        const value = await functions[permission].call(
          undefined,
          context,
          ...args
        );
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
              context,
              // @ts-ignore -- :spin-think: not sure what gives
              ...functionArgs
            );
            if (value instanceof Error) {
              log(context, "warn", "Permission function returned false", { value });
              return false;
            }
            return true;
          };
        }
        return permissions;
      },
    };
  };
}

export function requireAuth(context: Context) {
  if (!context.getCurrentUser()) {
    throw new Unauthorized(context);
  }
  return true as const;
}
