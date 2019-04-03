import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { expect } from "chai";

import createActivityEntry from "../activityEntries/create";
import addActivityQuery from "../../shared/queries/activities.create";

const { createTestClient } = require("apollo-server-testing");
const { createTestServer } = require("../helpers/createTestServer");

describe("ActivityEntry GraphQL Test", async function() {
  let user: any, server: any, query: any, mutate: any, activity: any;

  before(async () => {
    await clearDatabase();
    server = createTestClient(createTestServer(user));
    query = server.query;
    mutate = server.mutate;
    user = await createUser("testMan@test.com", "test password");
    activity = await mutate({
      mutation: addActivityQuery,
      variables: {
        name: "Test activity",
        description: "Test description",
        muscle_groups: "10000000000000"
      }
    });
  });

  it("lists food entries properly", async () => {
    await clearDatabase();

    const activityEntry = await createActivityEntry(
      user.id,
      activity.id,
      20020909,
      3,
      2500
    );

    //   foodLog = await query({
    //     query: foodLogQuery,
    //     variables: { day: 20192020 }
    //   });
    // expect(foodLog.data.foodEntries.length).to.equal(1);
    // expect(foodLog.data.foodEntries[0].id).to.equal(
    //   create.data.createFoodEntry.id
    // );
  });
});
