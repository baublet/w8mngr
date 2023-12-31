import { InsertableDatabaseRecord, Database } from "../../config/db.js";

export type UserEntity = InsertableDatabaseRecord<Database["user"]>;
