import { getUniqueId } from "../../shared/getUniqueId.js";
import { Context, createContext } from "../createContext.js";

export const runWithContext = async <T>(
  id: string,
  runner: (context: Context) => T,
): Promise<T> => {
  const context = await createContext({
    clientId: `${id}-${getUniqueId()}`,
  });

  const result = await runner(context);

  await context.destroy();

  return result;
};
