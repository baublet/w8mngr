import createFood from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import search from "./search";
import { UserType } from "../user/types";

describe("Foods: search", function() {
  let user: UserType;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    return Promise.resolve();
  });

  it("should search foods for the user", async () => {
    return new Promise(async (resolve, reject) => {
      const firstCount = await count(user.id),
        created1 = await createFood(user.id, "Name", "Description"),
        created2 = await createFood(user.id, "Name", "Description"),
        secondCount = await count(user.id);

      if (!created1 || !created2 || secondCount < firstCount) {
        return reject(
          `Second count (${secondCount}) is not greater than first count (${firstCount}).`
        );
      }

      const found = await search(user.id, "Name");
      if (!found || found.length < 2) {
        return reject(`Expected to find two elements.`);
      }

      resolve();
    });
  });
});
