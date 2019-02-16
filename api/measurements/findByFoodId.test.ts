import createUser from "../user/create";
import count from "./countByFoodId";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import createMeasurement from "./create";
import createFood from "../foods/create";
import { FoodType } from "../foods/types";
import { MeasurementType } from "./types";
import findByFoodId from "./findByFoodId";

describe("Measurement: find by food id", function() {
  let user: UserType, food: FoodType, measurement: MeasurementType;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    food = await createFood(user.id, "Name", "Description");
  });

  it("should create foods for the id", async () => {
    return new Promise(async (resolve, reject) => {
      const firstCount = await count(user.id),
        created1 = await createMeasurement(food.id, 1, "oz", 2, 3, 4, 5),
        created2 = await createMeasurement(food.id, 2, "grams", 2, 3, 4, 5),
        secondCount = await count(user.id);

      if (!created1 || !created2 || secondCount < firstCount) {
        return reject(
          `Second count (${secondCount}) is not greater than first count (${firstCount}).`
        );
      }

      const found = await findByFoodId(food.id);
      if (!found || found.length < 2) {
        return reject(`Expected to find two elements.`);
      }

      resolve();
    });
  });
});
