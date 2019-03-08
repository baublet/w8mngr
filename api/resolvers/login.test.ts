import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { expect } from "chai";
import loginQuery from "shared/queries/user.login";

const { createTestClient } = require("apollo-server-testing");
const { createTestServer } = require("../helpers/createTestServer");

describe("Login GraphQL Test", async function() {
  let user: any, server: any, query: any, mutate: any;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    server = createTestClient(createTestServer(user));
    query = server.query;
    mutate = server.mutate;
  });

  it("logs in properly", async () => {
    const login = await mutate({
      mutation: loginQuery,
      variables: {
        email: user.email,
        password: "test password"
      }
    });
    expect(login).to.have.property("data");
    expect(login.data).to.have.property("login");
    expect(login.data.login).to.have.property("user");
    expect(login.data.login).to.have.property("token");
    expect(login.data.login.user.email).to.equal("testman@test.com");
  });
});
