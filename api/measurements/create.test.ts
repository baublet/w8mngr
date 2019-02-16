import create from "./create";
import createFood from "../foods/create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { FoodType } from "api/foods/types";

describe("Measurement: create", function() {
  let user: UserType, food: FoodType;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    food = await createFood(user.id, "Name", "Description");
    return Promise.resolve();
  });

  it("should create measurement for a food", async () => {
    return new Promise(async (resolve, reject) => {
      const firstCount = await count(user.id),
        created = await create(food.id, 1, "oz", 2, 3, 4, 5),
        secondCount = await count(user.id);
      if (created && secondCount > firstCount) {
        resolve();
      } else {
        reject(
          `Second count (${secondCount}) is not greater than first count (${firstCount}).`
        );
      }
    });
  });
});
