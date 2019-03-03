import create from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { ActivityType } from "./types";
import deleteActivity from "./delete";

describe("Activity: delete", function() {
  let user: UserType, activity: ActivityType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    activity = await create(user.id, "Test Activity", "Description goes here");
  });

  it("should create activity for the user", async () => {
    const firstCount = await count(user.id),
      deleted = await deleteActivity(activity.id, user.id),
      secondCount = await count(user.id);
    if (!deleted || secondCount >= firstCount) {
      return `Second count (${secondCount}) is greater than or equal to first count (${firstCount}).`;
    }
  });
});
