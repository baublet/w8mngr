import { Resolvers } from "../../graphql-types";

import { currentUser } from "./currentUser";

export const resolvers: Resolvers = {
  Query: {
    currentUser,
  },
};
