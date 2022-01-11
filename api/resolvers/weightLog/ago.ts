import formatDistance from "date-fns/formatDistance";

import { WeightLogResolvers } from "../../graphql-types";

export const weightLogAgo: WeightLogResolvers["ago"] = async (parent) => {
  const lastLoggedDate = new Date(parent.createdAt);
  const now = new Date(new Date().toLocaleString(undefined, { timeZone: "UTC" }));

  return formatDistance(lastLoggedDate, now, {
    addSuffix: true,
  });
};
