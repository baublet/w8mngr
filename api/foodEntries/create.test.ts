import createFoodEntry from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";

describe("Food Entry: create food entry", function() {
  let user: UserType;
  const day = 20180501;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    return Promise.resolve();
  });

  it("should create food entry for the user and day", async () => {
    return new Promise(async (resolve, reject) => {
      const firstCount = await count(user.id),
        created = await createFoodEntry(
          user.id,
          day,
          "Description",
          5,
          10,
          15,
          20
        ),
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
