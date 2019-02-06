import createUser from "./create";
import countUsers from "./count";
import { clearDatabase } from "../../test/helpers";

describe("User: create user", function() {
  beforeEach(() => {
    return clearDatabase();
  });

  it("should create user and update the db", async () => {
    return new Promise(async (resolve, reject) => {
      const firstCount = await countUsers(),
        created = await createUser("testMan@test.com", "test password"),
        secondCount = await countUsers();
      if (created && secondCount > firstCount) {
        resolve();
      } else {
        reject(
          `Second count (${secondCount}) is not greater than first count (${firstCount}).`
        );
      }
    });
  });

  it("should create user and return expect input", async () => {
    return new Promise(async (resolve, reject) => {
      const created = await createUser("testMan@test.com", "test password");
      if (created && created.email == "testman@test.com") {
        resolve();
      } else {
        reject(`Unable to properly create user.`);
      }
    });
  });
});
