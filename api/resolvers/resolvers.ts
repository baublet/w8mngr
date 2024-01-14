import { Resolvers } from "../generated.js";
import { activityLogs } from "./activity/logs.js";
import { activityLibraryActivityMuscleGroups } from "./activityLibraryActivity/musclesGroups.js";
import { activityMuscleGroups } from "./activity/musclesGroups.js";
import { activityPermissions } from "./activity/permissions.js";
import { activityStats } from "./activity/stats.js";
import { activityLogActivity } from "./activityLog/activity.js";
import { activityLogWork } from "./activityLog/work.js";
import { currentUser } from "./currentUser.js";
import { foodImage } from "./food/image.js";
import { foodMeasurements } from "./food/measurements.js";
import { deleteActivityLog } from "./mutations/deleteActivityLog.js";
import { deleteFoodLog } from "./mutations/deleteFoodLog.js";
import { deleteFoodMeasurement } from "./mutations/deleteFoodMeasurement.js";
import { deleteWeightLog } from "./mutations/deleteWeightLog.js";
import { getUploadTokens } from "./mutations/getUploadTokens.js";
import { login } from "./mutations/login.js";
import { loginWithToken } from "./mutations/loginWithToken.js";
import { logout } from "./mutations/logout.js";
import { register } from "./mutations/register.js";
import { requestEmailLoginLink } from "./mutations/requestEmailLoginLink.js";
import { requestPasswordResetToken } from "./mutations/requestPasswordResetToken.js";
import { resetPassword } from "./mutations/resetPassword.js";
import { saveActivity } from "./mutations/saveActivity.js";
import { saveActivityLog } from "./mutations/saveActivityLog.js";
import { saveFood } from "./mutations/saveFood.js";
import { saveFoodLog } from "./mutations/saveFoodLog.js";
import { saveUploadData } from "./mutations/saveUploadData.js";
import { saveUserPreferences } from "./mutations/saveUserPreferences.js";
import { saveWeightLog } from "./mutations/saveWeightLog.js";
import { verifyEmail } from "./mutations/verifyEmail.js";
import { searchFoods } from "./searchFoods.js";
import { upload } from "./upload.js";
import { publicUrl } from "./upload/publicUrl.js";
import { activities } from "./user/activities.js";
import { userActivitySummary } from "./user/activitySummary.js";
import { foodLog } from "./user/foodLog.js";
import { userFoodLogStats } from "./user/foodLogStats.js";
import { foods } from "./user/foods.js";
import { userPopularActivities } from "./user/popularActivities.js";
import { userPopularFoods } from "./user/popularFoods.js";
import { usePreferences } from "./user/preferences.js";
import { userVerified } from "./user/verified.js";
import { weightLog } from "./user/weightLog.js";
import { userWeightLogSummary } from "./user/weightLogSummary.js";
import { weightLogAgo } from "./weightLog/ago.js";
import { weightLogWeight } from "./weightLog/weight.js";
import { weightLogWeightString } from "./weightLog/weightString.js";

export const resolvers: Resolvers = {
  ActivityLibraryActivity: {
    muscleGroups: activityLibraryActivityMuscleGroups,
  },
  ActivityLog: {
    activity: activityLogActivity,
    work: activityLogWork,
  },
  Activity: {
    logs: activityLogs,
    muscleGroups: activityMuscleGroups,
    permissions: activityPermissions,
    stats: activityStats,
  },
  User: {
    activities,
    activitySummary: userActivitySummary,
    foodLog,
    foodLogStats: userFoodLogStats,
    foods,
    popularActivities: userPopularActivities,
    popularFoods: userPopularFoods,
    preferences: usePreferences,
    verified: userVerified,
    weightLog,
    weightLogSummary: userWeightLogSummary,
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
    searchFoods,
  },
  Mutation: {
    deleteActivityLog,
    deleteFoodLog,
    deleteFoodMeasurement,
    deleteWeightLog,
    getUploadTokens,
    login,
    loginWithToken,
    logout,
    register,
    requestEmailLoginLink,
    requestPasswordResetToken,
    resetPassword,
    saveActivity,
    saveActivityLog,
    saveFood,
    saveFoodLog,
    saveUploadData,
    saveUserPreferences,
    saveWeightLog,
    verifyEmail,
  },
  ActivityOrActivityLibraryActivity: {
    __resolveType: (obj) => {
      const typename = obj.__typename;
      if (typename) {
        return typename;
      }

      const stats = "stats" in obj ? obj.stats : undefined;
      if (stats) {
        return "Activity";
      }

      return "ActivityLibraryActivity";
    },
  },
};
