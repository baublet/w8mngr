import { QueryResolvers } from "../graphql-types";

export const currentUser: QueryResolvers["currentUser"] = (
  parent,
  args,
  context
) => {
  return context.currentUser;
};
