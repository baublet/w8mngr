import formatDistance from "date-fns/formatDistance/index.js";

import { WeightLogResolvers } from "../../generated.js";

export const weightLogAgo: WeightLogResolvers["ago"] = async (parent) => {
  const lastLoggedDate = new Date(parent.createdAt);
  const now = new Date(
    new Date().toLocaleString(undefined, { timeZone: "UTC" }),
  );

  return formatDistance(lastLoggedDate, now, {
    addSuffix: true,
  });
};
