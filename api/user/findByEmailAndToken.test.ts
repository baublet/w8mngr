import createUser from "./create";
import findUserByEmailAndToken from "./findByEmailAndToken";
import issueToken from "./issueToken";
import { clearDatabase } from "../../test/helpers";

describe("User: find user by email and token", function() {
  before(async () => {
    return await clearDatabase();
  });
  it("should find a user by email and token", async () => {
    const user = await createUser("testMan@test.com", "test password"),
      token = await issueToken(user.id),
      foundWithToken = await findUserByEmailAndToken("testman@test.com", token);
    if (
      foundWithToken &&
      user &&
      user.email == foundWithToken.email &&
      foundWithToken.remember_digest == token
    ) {
      return;
    } else {
      return `Unable to find user by email and token. Emails should match: ${
        user.email
      }, ${
        foundWithToken ? foundWithToken.email : ""
      }; tokens should match: ${token}, ${
        foundWithToken ? foundWithToken.remember_digest : ""
      }`;
    }
  });
});
