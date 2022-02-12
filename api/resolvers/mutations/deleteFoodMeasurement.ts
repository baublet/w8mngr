import { assertIsTruthy } from "../../../shared";
import {
  foodDataService,
  foodMeasurementDataService,
} from "../../dataServices";
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
      food: foodDataService.findOneOrFail(context, (q) =>
        q.where("id", "=", foodId)
      ),
    };
  };
