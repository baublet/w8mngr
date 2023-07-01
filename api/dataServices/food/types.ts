import { InsertableDatabaseRecord, Database } from "../../config/db";

export type FoodEntity = InsertableDatabaseRecord<Database["food"]>;
