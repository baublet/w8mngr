import { InsertableDatabaseRecord, Database } from "../../config/db.js";

export type EmailEntity = InsertableDatabaseRecord<Database["email"]>;
