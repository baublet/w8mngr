import { InsertableDatabaseRecord, Database } from "../../config/db.js";

export type FoodLogFoodEntity = InsertableDatabaseRecord<
  Database["foodLogFood"]
>;
