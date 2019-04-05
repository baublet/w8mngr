import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { expect } from "chai";

import createActivityEntry from "../activityEntries/create";
import createActivityQuery from "../../shared/queries/activities.create";
import activityEntriesQuery from "../../shared/queries/activityEntries";

const { createTestClient } = require("apollo-server-testing");
const { createTestServer } = require("../helpers/createTestServer");

describe("ActivityEntry GraphQL Test", async function() {
  let user: any, server: any, query: any, mutate: any, activity: any;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    server = createTestClient(createTestServer(user));
    query = server.query;
    mutate = server.mutate;
    const activityCreator = await mutate({
      mutation: createActivityQuery,
      variables: {
        name: "Test activity",
        description: "Test description",
        muscle_groups: "10000000000000"
      }
    });
    activity = activityCreator.data.createActivity;
  });

  it("lists food entries properly", async () => {
    const activityEntry: any = await createActivityEntry(
      user.id,
      activity.id,
      20020909,
      3,
      2500
    );

    const activityLog = await query({
      query: activityEntriesQuery,
      variables: { activityId: activity.id, day: 20020909 }
    });

    expect(activityLog.data.activityEntries.length).to.equal(1);
    expect(activityLog.data.activityEntries[0].id).to.equal(activityEntry.id);
  });
});
