import { InsertableDatabaseRecord, Database } from "../../config/db.js";

export type ActivityLogEntity = InsertableDatabaseRecord<
  Database["activityLog"]
>;
