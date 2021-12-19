import { Resolvers } from "../graphql-types";

import { currentUser } from "./currentUser";
import { upload } from "./upload";

import { login } from "./mutations/login";
import { logout } from "./mutations/logout";
import { register } from "./mutations/register";
import { saveFoodLog } from "./mutations/saveFoodLog";
import { deleteFoodLog } from "./mutations/deleteFoodLog";
import { saveFood } from "./mutations/saveFood";
import { getUploadTokens } from "./mutations/getUploadTokens";
import { saveUploadData } from "./mutations/saveUploadData";
import { deleteFoodMeasurement } from "./mutations/deleteFoodMeasurement";
import { saveActivity } from "./mutations/saveActivity";

import { foodLog } from "./user/foodLog";
import { foods } from "./user/foods";
import { activities } from "./user/activities";

import { activityMuscleGroups } from "./activity/musclesGroups";

import { foodImage } from "./food/image";
import { foodMeasurements } from "./food/measurements";

import { publicUrl } from "./upload/publicUrl";

export const resolvers: Resolvers = {
  Activity: {
    muscleGroups: activityMuscleGroups,
  },
  User: {
    activities,
    foodLog,
    foods,
  },
  Food: {
    image: foodImage as any,
    measurements: foodMeasurements,
  },
  Upload: {
    publicUrl,
  },
  Query: {
    currentUser,
    upload,
  },
  Mutation: {
    getUploadTokens,
    login,
    logout,
    register,
    deleteFoodLog,
    saveFoodLog,
    saveFood,
    saveUploadData,
    deleteFoodMeasurement,
    saveActivity,
  },
};
