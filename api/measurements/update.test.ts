import update from "./update";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { FoodType } from "../foods/types";
import { MeasurementType } from "./types";
import createFood from "../foods/create";
import createMeasurement from "./create";

describe("Food: update", function() {
  let user: UserType, food: FoodType, measurement: MeasurementType | false;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    food = await createFood(user.id, "Name", "Description");
    measurement = await createMeasurement(
      food.id,
      user.id,
      1,
      "oz",
      2,
      3,
      4,
      5
    );
  });

  it("should update food entry properly", () => {
    return new Promise(async (resolve, reject) => {
      if (!measurement) {
        return resolve("failed to create measurement");
      }
      const updated = await update(
        measurement.id,
        food.id,
        user.id,
        2,
        "parsecs",
        3,
        4,
        5,
        6
      );
      if (
        updated &&
        (updated.amount == 2 &&
          updated.unit == "parsecs" &&
          updated.calories == 3 &&
          updated.fat == 4 &&
          updated.carbs == 5 &&
          updated.protein == 6)
      ) {
        resolve();
      } else {
        resolve("Did not update properly!");
      }
    });
  });
});
