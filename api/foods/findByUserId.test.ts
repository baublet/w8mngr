import createFoodEntry from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import findByUserId from "./findByUserId";
import { UserType } from "../user/types";

describe("Food: find by user id", function() {
  let user: UserType;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    return Promise.resolve();
  });

  it("should create foods for the user", async () => {
    return new Promise(async (resolve, reject) => {
      const firstCount = await count(user.id),
        created1 = await createFoodEntry(user.id, "Name", "Description"),
        created2 = await createFoodEntry(user.id, "Name", "Description"),
        secondCount = await count(user.id);

      if (!created1 || !created2 || secondCount < firstCount) {
        return reject(
          `Second count (${secondCount}) is not greater than first count (${firstCount}).`
        );
      }

      const found = await findByUserId(user.id);
      if (!found || found.length < 2) {
        return reject(`Expected to find two elements.`);
      }

      resolve();
    });
  });
});
