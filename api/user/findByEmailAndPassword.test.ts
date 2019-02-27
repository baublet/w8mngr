import createUser from "./create";
import findByEmailAndPassword from "./findByEmailAndPassword";
import { clearDatabase } from "../../test/helpers";

describe("User: find user by email and password", function() {
  before(async () => {
    return await clearDatabase();
  });
  it("should find a user by email and password", async () => {
    const user = await createUser("testMan@test.com", "test password"),
      found = await findByEmailAndPassword("testMAN@test.com", "test password");
    if (!found || found.email != "testman@test.com") {
      return `Unable to find users by email and password...`;
    }
  });
});
