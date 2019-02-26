import createUser from "../user/create";
import addFoodEntryQuery from "../../client/queries/foodEntry.add";
import updateFoodEntryQuery from "../../client/queries/foodEntry.update";
import deleteFoodEntryQuery from "../../client/queries/foodEntry.delete";
import foodLogQuery from "../../client/queries/foodLog";
import { clearDatabase } from "../../test/helpers";
import { expect } from "chai";
import count from "../foodEntries/countByUserId";

const { createTestClient } = require("apollo-server-testing");
const { createTestServer } = require("../helpers/createTestServer");

describe("FoodEntry Integration Test", async function() {
  let user, server, query, mutate;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    server = createTestClient(createTestServer(user));
    query = server.query;
    mutate = server.mutate;
  });

  async function createFoodEntry() {
    return mutate({
      mutation: addFoodEntryQuery,
      variables: {
        day: 20192020,
        description: "Test food entry",
        calories: 1,
        fat: 2,
        carbs: 3,
        protein: 4
      }
    });
  }

  it("lists food entries properly", async () => {
    await clearDatabase();
    const create = await createFoodEntry(),
      foodLog = await query({
        query: foodLogQuery,
        variables: { day: 20192020 }
      });
    expect(foodLog.data.foodEntries.length).to.equal(1);
    expect(foodLog.data.foodEntries[0].id).to.equal(
      create.data.createFoodEntry.id
    );
  });

  it("creates food entries properly", async () => {
    const create = await createFoodEntry();
    expect(create).to.have.property("data");
    expect(create.data).to.have.property("createFoodEntry");
    expect(create.data.createFoodEntry).to.have.property("id");
    expect(create.data.createFoodEntry.description).to.equal("Test food entry");
    expect(create.data.createFoodEntry.calories).to.equal(1);
    expect(create.data.createFoodEntry.fat).to.equal(2);
    expect(create.data.createFoodEntry.carbs).to.equal(3);
    expect(create.data.createFoodEntry.protein).to.equal(4);
  });

  it("updates food entries properly", async () => {
    const create = await createFoodEntry(),
      update = await mutate({
        mutation: updateFoodEntryQuery,
        variables: {
          id: create.data.createFoodEntry.id,
          description: "Updated food entry",
          calories: 2,
          fat: 3,
          carbs: 4,
          protein: 5
        }
      });
    expect(update).to.have.property("data");
    expect(update.data).to.have.property("updateFoodEntry");
    expect(update.data.updateFoodEntry).to.have.property("id");
    expect(update.data.updateFoodEntry.description).to.equal(
      "Updated food entry"
    );
    expect(update.data.updateFoodEntry.calories).to.equal(2);
    expect(update.data.updateFoodEntry.fat).to.equal(3);
    expect(update.data.updateFoodEntry.carbs).to.equal(4);
    expect(update.data.updateFoodEntry.protein).to.equal(5);
  });

  it("deletes food entries properly", async () => {
    const create = await createFoodEntry(),
      initialCount = await count(user.id),
      deleteMutation = await mutate({
        mutation: deleteFoodEntryQuery,
        variables: {
          id: create.data.createFoodEntry.id
        }
      }),
      afterDeleteCount = await count(user.id);
    expect(deleteMutation).to.have.property("data");
    expect(initialCount).to.be.greaterThan(afterDeleteCount);
  });
});
