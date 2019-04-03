import createActivity from "../activities/create";
import create from "./create";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { ActivityType } from "../activities/types";
import { ActivityEntryType } from "./types";
import findByUserIdAndActivityId from "./findByUserIdActivityIdAndDay";
import { expect } from "chai";

describe("ActivityEntries: find by user ID and activity ID", function() {
  let user: UserType,
    activity: ActivityType,
    entries: Array<ActivityEntryType> = [];

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    activity = await createActivity(
      user.id,
      "Test Activity",
      "Description goes here"
    );
    entries.push(await create(user.id, activity.id, 20200202, 10, 25));
    entries.push(await create(user.id, activity.id, 20200202, 12, 26));
  });

  it("should read activity entries by user id and activity id", async () => {
    const find = await findByUserIdAndActivityId(
      user.id,
      activity.id,
      20200202
    );
    expect(find).to.deep.equal(entries);
  });
});
