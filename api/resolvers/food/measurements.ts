import { foodMeasurementDataService } from "../../dataServices/foodMeasurement";
import { FoodResolvers } from "../../generated";

export const foodMeasurements: Required<FoodResolvers>["measurements"] = (
  parent,
  args,
  context
) => {
  return foodMeasurementDataService.getConnection(context, {
    constraint: {
      foodId: parent.id,
    },
  });
};
