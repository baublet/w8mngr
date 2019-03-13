import createActivity from "../activities/create";
import create from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { ActivityType } from "../activities/types";

describe("ActivityEntries: create", function() {
  let user: UserType, activity: ActivityType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    activity = await createActivity(
      user.id,
      "Test Activity",
      "Description goes here"
    );
  });

  it("should create activity entry for the user", async () => {
    const firstCount = await count(user.id),
      created = await create(user.id, activity.id, 20200202, 10, 25),
      secondCount = await count(user.id);
    if (!created || secondCount < firstCount) {
      return `Second count (${secondCount}) is not greater than first count (${firstCount}).`;
    }
  });
});
