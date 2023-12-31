import { InsertableDatabaseRecord, SelectableDatabaseRecord, Database } from "../../config/db.js";

export type FoodEntity = SelectableDatabaseRecord<Database["food"]>;
export type InsertableFoodEntity = InsertableDatabaseRecord<Database["food"]>;
