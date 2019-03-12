import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import createActivityQuery from "shared/queries/activities.create";
import updateActivityQuery from "shared/queries/activities.update";
import deleteActivityQuery from "shared/queries/activities.delete";
import activitiesQuery from "shared/queries/activities";
import readActivityQuery from "shared/queries/activities.read";
import searchActivitiesQuery from "shared/queries/activities.search";
import { expect } from "chai";
import countActivitiesByUserId from "../activities/countByUserId";

const { createTestClient } = require("apollo-server-testing");
const { createTestServer } = require("../helpers/createTestServer");

describe("Activities GraphQL Test", async function() {
  let user: any, server: any, query: any, mutate: any;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    server = createTestClient(createTestServer(user));
    query = server.query;
    mutate = server.mutate;
  });

  async function createActivity() {
    return await mutate({
      mutation: createActivityQuery,
      variables: {
        name: "Test activity",
        description: "Test description",
        muscle_groups: "10000000000000"
      }
    });
  }

  it("reads activity properly", async () => {
    const create = await createActivity(),
      activity = await query({
        query: readActivityQuery,
        variables: {
          id: create.data.createActivity.id
        }
      });
    expect(activity.data.activity).to.deep.equal(create.data.createActivity);
  });

  it("creates activities properly", async () => {
    const create = await createActivity();
    expect(create).to.have.property("data");
    expect(create.data).to.have.property("createActivity");
    expect(create.data.createActivity).to.have.property("id");
    expect(create.data.createActivity.name).to.equal("Test activity");
    expect(create.data.createActivity.description).to.equal("Test description");
  });

  it("updates activities properly", async () => {
    const create = await createActivity(),
      update = await mutate({
        mutation: updateActivityQuery,
        variables: {
          id: create.data.createActivity.id,
          user_id: user.id,
          name: "New name",
          description: "Updated description"
        }
      });
    expect(update).to.have.property("data");
    expect(update.data).to.have.property("updateActivity");
    expect(update.data.updateActivity).to.have.property("id");
    expect(update.data.updateActivity.name).to.equal("New name");
    expect(update.data.updateActivity.description).to.equal(
      "Updated description"
    );
  });

  it("deletes activities properly", async () => {
    const create = await createActivity(),
      initialCount = await countActivitiesByUserId(user.id),
      deleteMutation = await mutate({
        mutation: deleteActivityQuery,
        variables: {
          id: create.data.createActivity.id
        }
      }),
      afterDeleteCount = await countActivitiesByUserId(user.id);
    expect(deleteMutation).to.have.property("data");
    expect(initialCount).to.be.greaterThan(afterDeleteCount);
  });

  it("lists activities properly", async () => {
    const create = await createActivity(),
      activities = await query({
        query: activitiesQuery
      });
    expect(activities.data.activities.length).to.equal(4);
  });

  it("searches activities properly", async () => {
    const create = await createActivity(),
      activities = await query({
        query: searchActivitiesQuery,
        variables: {
          muscle_groups: ["biceps"]
        }
      });
    expect(activities.data.searchActivities.length).to.be.greaterThan(0);
  });
});
