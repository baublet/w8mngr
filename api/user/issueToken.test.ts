import createUser from "./create";
import issueToken from "./issueToken";
import findUserByEmail from "./findByEmail";
import { clearDatabase } from "../../test/helpers";

describe("User: issue token", function() {
  before(async () => {
    return await clearDatabase();
  });
  it("should issue a fresh token when requested", async () => {
    const created = await createUser("testMan@test.com", "test password"),
      issuedToken = await issueToken(created.id),
      user = await findUserByEmail("testman@test.com");
    if (!user || user.remember_digest != issuedToken) {
      return `Expected issued toke (${issueToken}) to equal token represented in persistence layer (${
        user ? user.remember_digest : ""
      })`;
    }
  });
});
