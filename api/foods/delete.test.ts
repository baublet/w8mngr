import createFood from "./create";
import deleteFood from "./delete";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { FoodType } from "./types";

describe("Food: delete", function() {
  let user: UserType, food: FoodType;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    food = await createFood(user.id, "Name", "Description");
  });

  it("should delete properly", () => {
    return new Promise(async (resolve, reject) => {
      const deleted = await deleteFood(food.id, user.id);
      if (deleted) {
        resolve();
      } else {
        resolve("Did not delete properly!");
      }
    });
  });
});
