import { InsertableDatabaseRecord, Database } from "../../config/db";

export type ActivityLog = InsertableDatabaseRecord<
  Database["activityLog"]
>;
