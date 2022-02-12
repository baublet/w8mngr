import { foodMeasurementDataService } from "../../dataServices";
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
