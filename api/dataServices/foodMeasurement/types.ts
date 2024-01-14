import { InsertableDatabaseRecord, Database } from "../../config/db.js";

export type FoodMeasurementEntity = InsertableDatabaseRecord<
  Database["foodMeasurement"]
>;
