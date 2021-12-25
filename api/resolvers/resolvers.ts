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
import { saveActivityLog } from "./mutations/saveActivityLog";

import { foodLog } from "./user/foodLog";
import { foods } from "./user/foods";
import { activities } from "./user/activities";

import { activityMuscleGroups } from "./activity/musclesGroups";
import { activityLogs } from "./activity/logs";
import { activityLogActivity } from "./activityLog/activity";
import { activityLogWork } from "./activityLog/work";

import { foodImage } from "./food/image";
import { foodMeasurements } from "./food/measurements";

import { publicUrl } from "./upload/publicUrl";

export const resolvers: Resolvers = {
  ActivityLog: {
    activity: activityLogActivity,
    work: activityLogWork,
  },
  Activity: {
    logs: activityLogs,
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
    deleteFoodLog,
    deleteFoodMeasurement,
    getUploadTokens,
    login,
    logout,
    register,
    saveActivity,
    saveActivityLog,
    saveFood,
    saveFoodLog,
    saveUploadData,
  },
};
