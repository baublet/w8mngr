import { InsertableDatabaseRecord, Database } from "../../config/db";

export type ActivityEntity = InsertableDatabaseRecord<
  Database["activity"]
>;
