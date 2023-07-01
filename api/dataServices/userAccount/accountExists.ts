import type { Context } from "../../createContext";
import { rootService } from "./rootService";

export async function accountExists(
  context: Context,
  {
    source,
    sourceIdentifier,
  }: {
    sourceIdentifier: string;
    source: string;
  }
): Promise<boolean> {
  const found = await rootService.findOneBy(context, (q) =>
    q
      .where("source", "=", source)
      .where("sourceIdentifier", "=", sourceIdentifier)
  );

  if (found) {
    return true;
  }

  return false;
}
