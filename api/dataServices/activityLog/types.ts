export type ActivityLog = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  activityId: string;
  day: string;
  reps: number;
  work: number;
};
