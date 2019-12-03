import { ResolversParentTypes, User } from "graphql-types";

export async function currentUser(
  parent: ResolversParentTypes,
  _args: null,
  context
): Promise<User> {
  return {
    id: "id",
    name: "Test Name",
    email: "test@gmail.com"
  };
}
