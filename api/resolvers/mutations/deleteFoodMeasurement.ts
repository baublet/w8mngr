import { foodDataService } from "../../dataServices/food/index.js";
import { foodMeasurementDataService } from "../../dataServices/foodMeasurement/index.js";
import { MutationResolvers } from "../../generated.js";

export const deleteFoodMeasurement: Required<MutationResolvers>["deleteFoodMeasurement"] =
  async (parent, { input }, context) => {
    const userId = context.getCurrentUserId(true);

    const { foodId } = await foodMeasurementDataService.deleteFoodMeasurement(
      context,
      {
        id: input.id,
        userId,
      }
    );

    return {
      food: foodDataService.findOneOrFail(context, foodId),
    };
  };
