import { QueryResolvers } from "../../graphql-types";

export const currentUser: QueryResolvers["currentUser"] = (
  parent,
  args,
  context
) => {
  return {
    id: "id",
    name: "Test Name",
    email: "test@gmail.com",
  };
};
