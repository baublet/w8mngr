import { Context } from "../../createContext";
import { getQuery } from "./query";
import { buildConnectionResolver } from "../../helpers";
import { assertIsTruthy } from "../../../shared";

export async function getConnection<TEntity, TNode>(
  context: Context,
  input: {
    userId?: string;
    day: string;
    connectionResolverParameters?: Parameters<
      typeof buildConnectionResolver
    >[1];
    nodeTransformer?: Parameters<typeof buildConnectionResolver>[2];
    additionalRootResolvers?: Record<string, any>;
  }
) {
  const queryBuilderProvider = await getQuery(context);
  const userId = input.userId || context.getCurrentUserId();
  assertIsTruthy(userId);

  const query = queryBuilderProvider();
  query
    .select("*")
    .where("userId", "=", userId)
    .andWhere("day", "=", input.day);

  return buildConnectionResolver(
    query,
    {
      ...input.connectionResolverParameters,
    },
    input.nodeTransformer,
    input.additionalRootResolvers
  );
}
