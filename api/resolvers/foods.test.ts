import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { expect } from "chai";
import count from "../foods/countByUserId";
import addFoodQuery from "../../client/queries/foods.create";
import foodsQuery from "../../client/queries/foods";
import updateFoodQuery from "../../client/queries/foods.update";
import deleteFoodQuery from "../../client/queries/foods.delete";

const { createTestClient } = require("apollo-server-testing");
const { createTestServer } = require("../helpers/createTestServer");

describe("Foods Integration Test", async function() {
  let user, server, query, mutate;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    server = createTestClient(createTestServer(user));
    query = server.query;
    mutate = server.mutate;
  });

  async function createFood() {
    return mutate({
      mutation: addFoodQuery,
      variables: {
        name: "Test food",
        description: "Test food description"
      }
    });
  }

  it("lists foods properly", async () => {
    await clearDatabase();
    const create = await createFood(),
      foodLog = await query({ query: foodsQuery });
    expect(foodLog.data.foods.length).to.equal(1);
    expect(foodLog.data.foods[0].id).to.equal(create.data.createFood.id);
  });

  it("creates foods properly", async () => {
    const create = await createFood();
    expect(create).to.have.property("data");
    expect(create.data).to.have.property("createFood");
    expect(create.data.createFood).to.have.property("id");
    expect(create.data.createFood.name).to.equal("Test food");
    expect(create.data.createFood.description).to.equal(
      "Test food description"
    );
  });

  it("updates foods properly", async () => {
    const create = await createFood(),
      update = await mutate({
        mutation: updateFoodQuery,
        variables: {
          id: create.data.createFood.id,
          name: "Updated food",
          description: "Updated food description"
        }
      });
    expect(update).to.have.property("data");
    expect(update.data).to.have.property("updateFood");
    expect(update.data.updateFood).to.have.property("id");
    expect(update.data.updateFood.description).to.equal(
      "Updated food description"
    );
    expect(update.data.updateFood.name).to.equal("Updated food");
  });

  it("deletes foods properly", async () => {
    const create = await createFood(),
      initialCount = await count(user.id),
      deleteMutation = await mutate({
        mutation: deleteFoodQuery,
        variables: {
          id: create.data.createFood.id
        }
      }),
      afterDeleteCount = await count(user.id);
    expect(deleteMutation).to.have.property("data");
    expect(initialCount).to.be.greaterThan(afterDeleteCount);
  });
});
