import create from "./create";
import findByUserId from "./findByUserId";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { expect } from "chai";

describe("Activity: find by user ID", function() {
  let user: UserType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
  });

  it("should read activities for the user", async () => {
    const created1 = await create(
        user.id,
        "Test Activity",
        "Description goes here"
      ),
      created2 = await create(
        user.id,
        "Test Activity",
        "Description goes here"
      ),
      activities = await findByUserId(user.id);
    expect(activities.length).to.equal(2);
    expect(activities).to.deep.equal([created1, created2]);
  });
});
