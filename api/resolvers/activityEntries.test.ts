import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { expect } from "chai";
import activityAndWorkToCalculated from "../../shared/transformers/activity/activityAndWorkToCalculated";

import createActivityEntry from "../activityEntries/create";

import activityEntriesQuery from "../../shared/queries/activityEntries";
import createActivityEntryQuery from "../../shared/queries/activityEntries.create";
import deleteActivityEntryQuery from "../../shared/queries/activityEntries.delete";

import createActivityQuery from "../../shared/queries/activities.create";
import { ActivityEntryType } from "../activityEntries/types";

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

  it("lists activity entries properly", async () => {
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

  it("creates activity entries properly", async () => {
    const createActivityEntry = await mutate({
      query: createActivityEntryQuery,
      variables: {
        activityId: activity.id,
        day: 20020909,
        reps: 3,
        work: 2500
      }
    });
    expect(createActivityEntry.data.createActivityEntry).to.have.property("id");

    const activityEntry: ActivityEntryType =
      createActivityEntry.data.createActivityEntry;
    expect(activityEntry.reps).to.equal(3);
    expect(activityEntry.work).to.equal(
      await activityAndWorkToCalculated(activity, "2500")
    );
  });

  it("deletes activity entries properly", async () => {
    const createActivityEntry = await mutate({
      query: createActivityEntryQuery,
      variables: {
        activityId: activity.id,
        day: 20020909,
        reps: 3,
        work: 2500
      }
    });
    expect(createActivityEntry.data.createActivityEntry).to.have.property("id");

    const deleteActivityEntry = await mutate({
      query: deleteActivityEntryQuery,
      variables: {
        id: createActivityEntry.data.createActivityEntry.id
      }
    });

    expect(deleteActivityEntry.data.deleteActivityEntry).to.equal(true);
  });
});
