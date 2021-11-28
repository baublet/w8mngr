import { Context } from "../../createContext";
import { getQuery } from "./query";
import { FoodMeasurement } from "./types";
import { foodMeasurementDataService } from "./index";

export async function deleteFoodMeasurement(
  context: Context,
  { id, userId }: { id: string; userId: string }
): Promise<FoodMeasurement> {
  const queryService = await getQuery(context);
  const query = queryService();

  const measurement = await foodMeasurementDataService.findOneOrFail(
    context,
    (q) => q.where("id", "=", id).andWhere("userId", "=", userId)
  );
  await query
    .delete()
    .where("id", "=", id)
    .andWhere("userId", "=", userId)
    .limit(1);

  return measurement;
}
