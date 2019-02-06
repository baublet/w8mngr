import createUser from "./create";
import findByEmail from "./findByEmail";
import { clearDatabase } from "../../test/helpers";

describe("User: find user by email", function() {
  before(() => {
    return clearDatabase();
  });
  it("should find a user by email", async () => {
    return new Promise(async (resolve, reject) => {
      const user = await createUser("testMan@test.com", "test password"),
        found = await findByEmail("testMAN@test.com");
      if (found && found.email == "testman@test.com") {
        resolve();
      } else {
        reject(`Unable to find users by email...`);
      }
    });
  });
});
