import { dayStringFromDate } from "../../../shared/dayStringFromDate.js";
import { activityDataService } from "../../dataServices/activity/index.js";
import { activityLogDataService } from "../../dataServices/activityLog/index.js";
import { ActivityLibraryActivityResolvers } from "../../generated.js";

export const activityLogActivityLog: ActivityLibraryActivityResolvers["logs"] =
  async (parent, args, context) => {
    const day = args.day || dayStringFromDate(new Date());
    const userId = context.getCurrentUserId(true);
    const activityLibraryActivityId = parent.id;

    const userActivityForThisLibraryEntry = await activityDataService.findOneBy(
      context,
      (q) =>
        q
          .where("userId", "=", userId)
          .where("activityLibraryId", "=", activityLibraryActivityId),
    );

    // If one doesn't exist, the user hasn't logged any activities here, yet, so
    // return an empty connection
    if (!userActivityForThisLibraryEntry) {
      return {
        day,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
        edges: [],
      };
    }

    console.log(JSON.stringify(userActivityForThisLibraryEntry));

    const connection = await activityLogDataService.getConnection(context, {
      applyCustomConstraint: (q) =>
        q
          .where("userId", "=", userId)
          .where("day", "=", day)
          .where("activityId", "=", userActivityForThisLibraryEntry.id),
      additionalRootResolvers: {
        day,
      },
    });

    if (connection instanceof Error) {
      throw connection;
    }

    return connection;
  };
