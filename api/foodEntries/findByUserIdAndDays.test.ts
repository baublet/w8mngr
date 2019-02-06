import createFoodEntry from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import findByUserIdAndDay from "./findByUserIdAndDays";
import { UserType } from "../user/types";

describe("Food Entry: find by user id and days", function() {
  let user: UserType;
  const days = [20180501, 20180502];

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    return Promise.resolve();
  });

  it("should create food entry for the user and day", async () => {
    return new Promise(async (resolve, reject) => {
      const firstCount = await count(user.id),
        created1 = await createFoodEntry(
          user.id,
          20180501,
          "Description",
          5,
          10,
          15,
          20
        ),
        created2 = await createFoodEntry(
          user.id,
          20180502,
          "Description",
          5,
          10,
          15,
          20
        ),
        secondCount = await count(user.id);

      if (!created1 || !created2 || secondCount < firstCount) {
        return reject(
          `Second count (${secondCount}) is not greater than first count (${firstCount}).`
        );
      }

      const found = await findByUserIdAndDay(user.id, days);
      if (!found || found.length < 2) {
        return reject(`Expected to find two elements.`);
      }

      resolve();
    });
  });
});
