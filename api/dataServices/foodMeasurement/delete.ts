import { Context } from "../../createContext.js";
import { rootService } from "./rootService.js";
import { FoodMeasurementEntity } from "./types.js";

export async function deleteFoodMeasurement(
  context: Context,
  { id, userId }: { id: string; userId: string }
): Promise<FoodMeasurementEntity> {
  const measurement = await rootService.findOneOrFailBy(context, (q) =>
    q.where("id", "=", id).where("userId", "=", userId)
  );
  await rootService.deleteByIds(context, [measurement.id]);

  return measurement;
}
