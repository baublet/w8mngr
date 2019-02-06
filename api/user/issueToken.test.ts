import createUser from "./create";
import issueToken from "./issueToken";
import findUserByEmail from "./findByEmail";
import { clearDatabase } from "../../test/helpers";

describe("User: issue token", function() {
  before(() => {
    return clearDatabase();
  });
  it("should issue a fresh token when requested", async () => {
    return new Promise(async resolve => {
      const created = await createUser("testMan@test.com", "test password"),
        issuedToken = await issueToken(created.id),
        user = await findUserByEmail("testman@test.com");
      if (user && user.remember_digest == issuedToken) {
        resolve();
      } else {
        resolve(
          `Expected issued toke (${issueToken}) to equal token represented in persistence layer (${
            user ? user.remember_digest : ""
          })`
        );
      }
    });
  });
});
