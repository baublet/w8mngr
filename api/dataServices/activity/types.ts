import { InsertableDatabaseRecord, Database } from "../../config/db";

export type Activity = InsertableDatabaseRecord<
  Database["activity"]
>;
