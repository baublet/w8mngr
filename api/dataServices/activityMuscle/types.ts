import { Muscle } from "../../graphql-types";

export type ActivityMuscle = {
  id: string;
  activityId: string;
  muscle: Muscle;
};
