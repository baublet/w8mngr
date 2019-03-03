import create from "./create";
import update from "./update";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { ActivityType } from "./types";
import { expect } from "chai";

describe("Activity: update", function() {
  let user: UserType, activity: ActivityType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    activity = await create(user.id, "Test Activity", "Description goes here");
  });

  it("should update activity for the user", async () => {
    const updated = await update(
      activity.id,
      user.id,
      "Updated Activity",
      "Updated description",
      "exrx URL",
      3,
      "11111111111111",
      10
    );
    expect(updated.id).to.equal(activity.id);
    expect(updated.name).to.equal("Updated Activity");
    expect(updated.description).to.equal("Updated description");
    expect(updated.exrx).to.equal("exrx URL");
    expect(updated.activity_type).to.equal(3);
    expect(updated.muscle_groups).to.equal("11111111111111");
    expect(updated.intensity).to.equal(10);
  });
});
