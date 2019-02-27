import createUser from "./create";
import findByEmail from "./findByEmail";
import { clearDatabase } from "../../test/helpers";

describe("User: find user by email", function() {
  before(async () => {
    return await clearDatabase();
  });
  it("should find a user by email", async () => {
    const user = await createUser("testMan@test.com", "test password"),
      found = await findByEmail("testMAN@test.com");
    if (!found || found.email != "testman@test.com") {
      return `Unable to find users by email...`;
    }
  });
});
