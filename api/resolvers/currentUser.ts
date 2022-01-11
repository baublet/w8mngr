import { QueryResolvers, User } from "../graphql-types";

export const currentUser: Required<QueryResolvers>["currentUser"] = (
  parent,
  args,
  context
) => {
  const user: User | undefined = context.getCurrentUser() as any;
  return user;
};
