import create from "./create";
import read from "./read";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { expect } from "chai";
import createActivity from "../activities/create";

describe("Activity: read", function() {
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

  it("should read activity for the user", async () => {
    const created = await create(user.id, activity.id, 20020909, 2, 2500),
      fromRead = await read(created.id);

    expect(created).to.deep.equal(fromRead);
  });
});
