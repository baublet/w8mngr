import { InsertableDatabaseRecord, Database } from "../../config/db";

export type FoodLogEntity = InsertableDatabaseRecord<Database["foodLog"]>;
