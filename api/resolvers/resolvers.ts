import { Resolvers } from "../graphql-types";
import { activityLogs } from "./activity/logs";
import { activityMuscleGroups } from "./activity/musclesGroups";
import { activityPermissions } from "./activity/permissions";
import { activityStats } from "./activity/stats";
import { activityLogActivity } from "./activityLog/activity";
import { activityLogWork } from "./activityLog/work";
import { currentUser } from "./currentUser";
import { foodImage } from "./food/image";
import { foodMeasurements } from "./food/measurements";
import { deleteActivityLog } from "./mutations/deleteActivityLog";
import { deleteFoodLog } from "./mutations/deleteFoodLog";
import { deleteFoodMeasurement } from "./mutations/deleteFoodMeasurement";
import { deleteWeightLog } from "./mutations/deleteWeightLog";
import { getUploadTokens } from "./mutations/getUploadTokens";
import { login } from "./mutations/login";
import { loginWithToken } from "./mutations/loginWithToken";
import { logout } from "./mutations/logout";
import { register } from "./mutations/register";
import { requestEmailLoginLink } from "./mutations/requestEmailLoginLink";
import { requestPasswordResetToken } from "./mutations/requestPasswordResetToken";
import { resetPassword } from "./mutations/resetPassword";
import { saveActivity } from "./mutations/saveActivity";
import { saveActivityLog } from "./mutations/saveActivityLog";
import { saveFood } from "./mutations/saveFood";
import { saveFoodLog } from "./mutations/saveFoodLog";
import { saveUploadData } from "./mutations/saveUploadData";
import { saveWeightLog } from "./mutations/saveWeightLog";
import { verifyEmail } from "./mutations/verifyEmail";
import { searchFoods } from "./searchFoods";
import { upload } from "./upload";
import { publicUrl } from "./upload/publicUrl";
import { activities } from "./user/activities";
import { userActivitySummary } from "./user/activitySummary";
import { foodLog } from "./user/foodLog";
import { userFoodLogStats } from "./user/foodLogStats";
import { foods } from "./user/foods";
import { popularUserActivities } from "./user/popularActivities";
import { userVerified } from "./user/verified";
import { weightLog } from "./user/weightLog";
import { weightLogAgo } from "./weightLog/ago";
import { weightLogWeight } from "./weightLog/weight";
import { weightLogWeightString } from "./weightLog/weightString";

export const resolvers: Resolvers = {
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
    foods,
    popularActivities: popularUserActivities,
    foodLogStats: userFoodLogStats,
    weightLog,
    verified: userVerified,
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
    saveWeightLog,
    verifyEmail,
  },
};
