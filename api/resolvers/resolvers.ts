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
import { deleteActivityLog } from "./mutations/deleteActivityLog";
import { saveWeightLog } from "./mutations/saveWeightLog";
import { deleteWeightLog } from "./mutations/deleteWeightLog";
import { requestPasswordResetToken } from "./mutations/requestPasswordResetToken";
import { verifyEmail } from "./mutations/verifyEmail";

import { foodLog } from "./user/foodLog";
import { foods } from "./user/foods";
import { activities } from "./user/activities";
import { popularUserActivities } from "./user/popularActivities";
import { userFoodLogStats } from "./user/foodLogStats";
import { weightLog } from "./user/weightLog";
import { userActivitySummary } from "./user/activitySummary";

import { activityMuscleGroups } from "./activity/musclesGroups";
import { activityLogs } from "./activity/logs";
import { activityStats } from "./activity/stats";
import { activityLogActivity } from "./activityLog/activity";
import { activityLogWork } from "./activityLog/work";

import { foodImage } from "./food/image";
import { foodMeasurements } from "./food/measurements";

import { publicUrl } from "./upload/publicUrl";

import { weightLogWeightString } from "./weightLog/weightString";
import { weightLogWeight } from "./weightLog/weight";
import { weightLogAgo } from "./weightLog/ago";

export const resolvers: Resolvers = {
  ActivityLog: {
    activity: activityLogActivity,
    work: activityLogWork,
  },
  Activity: {
    logs: activityLogs,
    muscleGroups: activityMuscleGroups,
    stats: activityStats,
  },
  User: {
    activities,
    activitySummary: userActivitySummary,
    foodLog,
    foods,
    popularActivities: popularUserActivities,
    foodLogStats: userFoodLogStats,
    weightLog,
  },
  Food: {
    image: foodImage,
    measurements: foodMeasurements,
  },
  Upload: {
    publicUrl,
  },
  WeightLog: {
    ago: weightLogAgo,
    weight: weightLogWeight,
    weightString: weightLogWeightString,
  },
  Query: {
    currentUser,
    upload,
  },
  Mutation: {
    deleteActivityLog,
    deleteFoodLog,
    deleteFoodMeasurement,
    deleteWeightLog,
    getUploadTokens,
    login,
    logout,
    register,
    requestPasswordResetToken,
    saveActivity,
    saveActivityLog,
    saveFood,
    saveFoodLog,
    saveUploadData,
    saveWeightLog,
    verifyEmail,
  },
};
