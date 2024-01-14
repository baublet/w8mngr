import { foodMeasurementDataService } from "../../dataServices/foodMeasurement/index.js";
import { FoodResolvers } from "../../generated.js";

export const foodMeasurements: Required<FoodResolvers>["measurements"] = (
  parent,
  args,
  context,
) => {
  return foodMeasurementDataService.getConnection(context, {
    constraint: {
      foodId: parent.id,
    },
  });
};
