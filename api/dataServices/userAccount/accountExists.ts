import { Context } from "../../createContext";
import { getQuery } from "./query";

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
  const queryFactory = await getQuery(context);
  const found = await queryFactory()
    .select("*")
    .where("source", "=", source)
    .andWhere("sourceIdentifier", "=", sourceIdentifier)
    .limit(1);

  const foundItem = found[0];

  if (foundItem) {
    return true;
  }

  return false;
}
