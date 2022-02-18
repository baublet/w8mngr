import { ulid } from "ulid";

import { Context, createContext } from "../createContext";

export const runWithContext = async <T>(
  id: string,
  runner: (context: Context) => T
): Promise<T> => {
  const context = await createContext({
    clientId: `${id}-${ulid()}`,
  });

  const result = await runner(context);

  await context.destroy();

  return result;
};
