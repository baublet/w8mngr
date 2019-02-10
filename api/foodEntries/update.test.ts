import createFoodEntry from "./create";
import updateFoodEntry from "./update";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { FoodEntryType } from "./types";

describe("Food Entry: update food entry", function() {
  let user: UserType, foodEntry: FoodEntryType;
  const day = 20180501;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    foodEntry = await createFoodEntry(
      user.id,
      day,
      "Description",
      5,
      10,
      15,
      20
    );
  });

  it("should update food entry properly", () => {
    return new Promise(async (resolve, reject) => {
      const updated = await updateFoodEntry(
        foodEntry.id,
        user.id,
        "New Description",
        6,
        11,
        16,
        21
      );
      if (
        updated &&
        (updated.description == "New Description" &&
          updated.calories == 6 &&
          updated.fat == 11 &&
          updated.carbs == 16 &&
          updated.protein == 21)
      ) {
        resolve();
      } else {
        resolve("Did not update properly!");
      }
    });
  });
});
