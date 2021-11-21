import { Context } from "../../createContext";
import { query } from "./query";

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
  const found = await query(context, async (query) => {
    query
      .select("*")
      .where("source", "=", source)
      .andWhere("sourceIdentifier", "=", sourceIdentifier)
      .limit(1);
    return query;
  });

  const foundItem = found[0];

  if (foundItem) {
    return true;
  }

  return false;
}
