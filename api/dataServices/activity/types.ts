import { ActivityType } from "../../graphql-types";

export type Activity = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exrx?: string;
  activityType: ActivityType;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
  intensity: number;
  archived: Boolean;
};
