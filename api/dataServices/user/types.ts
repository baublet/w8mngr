import { InsertableDatabaseRecord, Database } from "../../config/db";

export type UserEntity = InsertableDatabaseRecord<Database["user"]>;
