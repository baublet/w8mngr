import { handler as registerHandler } from "./register";
import { clearDatabase } from "../test/helpers";

describe("Register controller", function() {
  beforeEach(() => {
    return clearDatabase();
  });

  it("should create user and return proper message", () => {
    return new Promise(async (resolve, reject) => {
      const requestBody = JSON.stringify({
        email: "test@testerson.com",
        password: "test"
      });
      const result = await registerHandler({
        body: requestBody
      });
      if (JSON.parse(<string>result.body).user.id) {
        resolve();
      } else {
        reject(result);
      }
    });
  });

  it("should create user once, but not a second time", () => {
    return new Promise(async (resolve, reject) => {
      const requestBody = JSON.stringify({
        email: "test@testerson.com",
        password: "test"
      });
      const firstRequest = await registerHandler({
        body: requestBody
      });

      const secondRequest = await registerHandler({
        body: requestBody
      });

      if (JSON.parse(<string>secondRequest.body).error == false) {
        console.log(secondRequest.body);
        reject("Allowed registration of existing user!");
      } else {
        resolve();
      }
    });
  });
});
