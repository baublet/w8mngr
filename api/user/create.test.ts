import createUser from "./create";
import countUsers from "./count";
import { clearDatabase } from "../../test/helpers";

describe("User: create user", function() {
  beforeEach(async () => {
    return await clearDatabase();
  });

  it("should create user and update the db", async () => {
    const firstCount = await countUsers(),
      created = await createUser("testMan@test.com", "test password"),
      secondCount = await countUsers();
    if (!created || secondCount < firstCount) {
      return `Second count (${secondCount}) is not greater than first count (${firstCount}).`;
    }
  });

  it("should create user and return expect input", async () => {
    const created = await createUser("testMan@test.com", "test password");
    if (!created || created.email != "testman@test.com") {
      return `Unable to properly create user.`;
    }
  });
});
