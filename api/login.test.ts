import { handler as loginHandler } from "./login";
import createUser from "./user/create";
import { verify } from "jsonwebtoken";
import secrets from "./config/secrets";
import { clearDatabase } from "../test/helpers";

describe("Login controller", function() {
  beforeEach(async () => {
    await clearDatabase();
    return createUser("test@user.com", "password man");
  });

  it("should authorize and give a valid jwt token", async () => {
    return new Promise(async (resolve, reject) => {
      const requestBody = JSON.stringify({
        email: "test@user.com",
        password: "password man"
      });
      const loginRequest = await loginHandler({
        body: requestBody
      });
      const token = JSON.parse(<string>loginRequest.body).token;
      verify(token, secrets.jwtSecret, err => {
        if (err) {
          reject("Uh oh... issued an invalid token: " + err);
        } else {
          resolve();
        }
      });
    });
  });
});
