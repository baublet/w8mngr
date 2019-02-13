import createFoodEntry from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import read from "./read";
import { UserType } from "../user/types";

describe("Foods: read", function() {
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
        secondCount = await count(user.id);

      if (!created1 || secondCount < firstCount) {
        return reject(
          `Second count (${secondCount}) is not greater than first count (${firstCount}).`
        );
      }

      const found = await read(user.id, created1.id);
      if (!found) {
        return reject(`Expected to read food properly`);
      }

      resolve();
    });
  });
});
