import { InsertableDatabaseRecord, Database } from "../../config/db";

export type ActivityLogEntity = InsertableDatabaseRecord<
  Database["activityLog"]
>;
