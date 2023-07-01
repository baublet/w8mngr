import { foodDataService } from "../../dataServices/food";
import { foodMeasurementDataService } from "../../dataServices/foodMeasurement";
import { MutationResolvers } from "../../generated";

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
