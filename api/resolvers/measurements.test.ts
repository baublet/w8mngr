import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { expect } from "chai";
import addFoodQuery from "../../client/queries/foods.create";
import createMeasurementQuery from "../../client/queries/measurement.create";
import updateMeasurementQuery from "../../client/queries/measurement.update";
import deleteMeasurementQuery from "../../client/queries/measurement.delete";
import foodReadQuery from "../../client/queries/foods.read";

const { createTestClient } = require("apollo-server-testing");
const { createTestServer } = require("../helpers/createTestServer");

describe("Measurements GraphQL Test", async function() {
  let user, server, query, mutate, food;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    server = createTestClient(createTestServer(user));
    query = server.query;
    mutate = server.mutate;
    const createFood = await mutate({
      mutation: addFoodQuery,
      variables: {
        name: "Test food",
        description: "Test food description"
      }
    });
    food = createFood.data.createFood;
  });

  it("creates measurements properly", async () => {
    const create = await mutate({
      mutation: createMeasurementQuery,
      variables: {
        food_id: food.id,
        amount: 1,
        unit: "grams",
        calories: 2,
        fat: 3,
        carbs: 4,
        protein: 5
      }
    });
    expect(create).to.have.property("data");
    expect(create.data).to.have.property("createMeasurement");
    expect(create.data.createMeasurement).to.have.property("id");
    expect(create.data.createMeasurement.amount).to.equal(1);
    expect(create.data.createMeasurement.unit).to.equal("grams");
    expect(create.data.createMeasurement.calories).to.equal(2);
    expect(create.data.createMeasurement.fat).to.equal(3);
    expect(create.data.createMeasurement.carbs).to.equal(4);
    expect(create.data.createMeasurement.protein).to.equal(5);
  });

  it("lists measurements properly", async () => {
    const create = await mutate({
        mutation: createMeasurementQuery,
        variables: {
          food_id: food.id,
          amount: 1,
          unit: "grams",
          calories: 2,
          fat: 3,
          carbs: 4,
          protein: 5
        }
      }),
      readFood = await query({
        query: foodReadQuery,
        variables: {
          id: food.id
        }
      });
    expect(readFood.data.food.id).to.equal(food.id);
    expect(readFood.data.food.measurements.length).to.equal(2);
  });

  it("updates measurements properly", async () => {
    const create = await mutate({
      mutation: createMeasurementQuery,
      variables: {
        food_id: food.id,
        amount: 1,
        unit: "grams",
        calories: 2,
        fat: 3,
        carbs: 4,
        protein: 5
      }
    });
    const update = await mutate({
      mutation: updateMeasurementQuery,
      variables: {
        id: create.data.createMeasurement.id,
        food_id: food.id,
        amount: 1,
        unit: "grams",
        calories: 2,
        fat: 3,
        carbs: 4,
        protein: 5
      }
    });
    expect(update).to.have.property("data");
    expect(update.data).to.have.property("updateMeasurement");
    expect(update.data.updateMeasurement).to.have.property("id");
    expect(update.data.updateMeasurement.amount).to.equal(1);
    expect(update.data.updateMeasurement.unit).to.equal("grams");
    expect(update.data.updateMeasurement.calories).to.equal(2);
    expect(update.data.updateMeasurement.fat).to.equal(3);
    expect(update.data.updateMeasurement.carbs).to.equal(4);
    expect(update.data.updateMeasurement.protein).to.equal(5);
  });

  it("deletes measurements properly", async () => {
    const create = await mutate({
      mutation: createMeasurementQuery,
      variables: {
        food_id: food.id,
        amount: 1,
        unit: "grams",
        calories: 2,
        fat: 3,
        carbs: 4,
        protein: 5
      }
    });
    const del = await mutate({
      mutation: deleteMeasurementQuery,
      variables: {
        id: create.data.createMeasurement.id,
        food_id: food.id
      }
    });
    expect(del.data.deleteMeasurement).to.equal(true);
  });
});
