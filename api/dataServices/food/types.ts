import { InsertableDatabaseRecord, SelectableDatabaseRecord, Database } from "../../config/db";

export type FoodEntity = SelectableDatabaseRecord<Database["food"]>;
export type InsertableFoodEntity = InsertableDatabaseRecord<Database["food"]>;
