import create from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";

describe("Food: create", function() {
  let user: UserType;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    return Promise.resolve();
  });

  it("should create food for the user", async () => {
    return new Promise(async (resolve, reject) => {
      const firstCount = await count(user.id),
        created = await create(user.id, "Name", "Description"),
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
