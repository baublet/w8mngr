import { InsertableDatabaseRecord, Database } from "../../config/db.js";

export type UserAccountEntity = InsertableDatabaseRecord<Database["userAccount"]>;
