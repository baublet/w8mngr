import { InsertableDatabaseRecord, Database } from "../../config/db.js";

export type ActivityLibraryEntity = InsertableDatabaseRecord<
  Database["activityLibrary"]
>;
