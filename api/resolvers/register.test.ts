import { clearDatabase } from "../../test/helpers";
import { expect } from "chai";
import registerQuery from "shared/queries/user.create";

const { createTestClient } = require("apollo-server-testing");
const { createTestServer } = require("../helpers/createTestServer");

describe("Register GraphQL Test", async function() {
  let user: any, server: any, mutate: any;

  before(async () => {
    await clearDatabase();
    server = createTestClient(createTestServer(user));
    mutate = server.mutate;
  });

  it("registers and logs in properly", async () => {
    const register = await mutate({
      mutation: registerQuery,
      variables: {
        email: "testMan@test.com",
        password: "test password"
      }
    });
    expect(register).to.have.property("data");
    expect(register.data).to.have.property("register");
    expect(register.data.register).to.have.property("user");
    expect(register.data.register).to.have.property("token");
    expect(register.data.register.user.email).to.equal("testman@test.com");
  });
});
