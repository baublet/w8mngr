import { Resolvers } from "../graphql-types";

import { currentUser } from "./currentUser";

import { login } from "./mutations/login";
import { logout } from "./mutations/logout";
import { register } from "./mutations/register";

export const resolvers: Resolvers = {
  Query: {
    currentUser,
  },
  Mutation: {
    login,
    logout,
    register,
  },
};
