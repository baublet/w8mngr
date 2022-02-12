import { ActivityType } from "../../generated";

export type Activity = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exrx?: string;
  type: ActivityType;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
  intensity: number;
  archived: Boolean;
  legacyId?: number;
};
