import createUser from "./create";
import findByEmailAndPassword from "./findByEmailAndPassword";
import { clearDatabase } from "../../test/helpers";

describe("User: find user by email and password", function() {
  before(() => {
    return clearDatabase();
  });
  it("should find a user by email and password", async () => {
    return new Promise(async (resolve, reject) => {
      const user = await createUser("testMan@test.com", "test password"),
        found = await findByEmailAndPassword(
          "testMAN@test.com",
          "test password"
        );
      if (found && found.email == "testman@test.com") {
        resolve();
      } else {
        reject(`Unable to find users by email and password...`);
      }
    });
  });
});
