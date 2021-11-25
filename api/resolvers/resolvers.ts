import { Resolvers } from "../graphql-types";

import { currentUser } from "./currentUser";

import { login } from "./mutations/login";
import { logout } from "./mutations/logout";
import { register } from "./mutations/register";
import { saveFoodLog } from "./mutations/saveFoodLog";
import { deleteFoodLog } from "./mutations/deleteFoodLog";
import { saveFood } from "./mutations/saveFood";
import { getUploadTokens } from "./mutations/getUploadTokens";

import { foodLog } from "./user/foodLog";
import { foods } from "./user/foods";

export const resolvers: Resolvers = {
  User: {
    foodLog,
    foods,
  },
  Query: {
    currentUser,
  },
  Mutation: {
    getUploadTokens,
    login,
    logout,
    register,
    deleteFoodLog,
    saveFoodLog,
    saveFood,
  },
};
