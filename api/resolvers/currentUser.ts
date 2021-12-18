import { QueryResolvers } from "../graphql-types";

export const currentUser: Required<QueryResolvers>["currentUser"] = (
  parent,
  args,
  context
) => {
  return context.currentUser || null;
};
