import createActivity from "../activities/create";
import create from "./create";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { ActivityType } from "../activities/types";
import { ActivityEntryType } from "./types";
import updateActivityEntry from "./update";
import { expect } from "chai";

describe("ActivityEntries: update", function() {
  let user: UserType, activity: ActivityType, entry: ActivityEntryType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    activity = await createActivity(
      user.id,
      "Test Activity",
      "Description goes here"
    );
    entry = await create(user.id, activity.id, 20200202, 10, 25);
  });

  it("should update activity entry for the user", async () => {
    const updated = await updateActivityEntry(entry.id, user.id, 11, 26);
    expect(updated.reps).to.equal(11);
    expect(updated.work).to.equal(26);
  });
});
