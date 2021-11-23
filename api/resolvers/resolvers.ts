import { Resolvers } from "../graphql-types";

import { currentUser } from "./currentUser";

import { login } from "./mutations/login";
import { logout } from "./mutations/logout";
import { register } from "./mutations/register";
import { saveFoodLog } from "./mutations/saveFoodLog";

import { foodLog } from "./user/foodLog";

export const resolvers: Resolvers = {
  User: {
    foodLog,
  },
  Query: {
    currentUser,
  },
  Mutation: {
    login,
    logout,
    register,
    saveFoodLog,
  },
};
