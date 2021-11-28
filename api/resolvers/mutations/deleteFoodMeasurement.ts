import { MutationResolvers } from "../../graphql-types";
import {
  foodMeasurementDataService,
  foodDataService,
} from "../../dataServices";
import { assertIsTruthy } from "../../../shared";

export const deleteFoodMeasurement: Required<MutationResolvers>["deleteFoodMeasurement"] =
  async (parent, { input }, context) => {
    const userId = context.currentUser?.id;
    assertIsTruthy(userId);

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
