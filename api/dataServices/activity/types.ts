import { InsertableDatabaseRecord, Database } from "../../config/db.js";

export type ActivityEntity = InsertableDatabaseRecord<Database["activity"]>;
