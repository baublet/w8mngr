import createFoodEntry from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import read from "./read";
import { UserType } from "../user/types";

describe("Foods: read", function() {
  let user: UserType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    return Promise.resolve();
  });

  it("should read foods by id", async () => {
    const firstCount = await count(user.id),
      created1 = await createFoodEntry(user.id, "Name", "Description"),
      secondCount = await count(user.id);

    if (!created1 || secondCount < firstCount) {
      return `Second count (${secondCount}) is not greater than first count (${firstCount}).`;
    }

    const found = await read(user.id, created1.id);
    if (!found) {
      return `Expected to read food properly`;
    }
  });
});
