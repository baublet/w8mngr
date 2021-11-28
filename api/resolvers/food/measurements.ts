import { FoodResolvers } from "../../graphql-types";
import { foodMeasurementDataService } from "../../dataServices";

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
