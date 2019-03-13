import create from "./create";
import search from "./search";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { expect } from "chai";
import { ActivityType } from "./types";

describe("Activity: search", function() {
  let user: UserType, activity: ActivityType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    activity = await create(
      user.id,
      "Test Activity",
      "Description goes here",
      "",
      0,
      "10000000000000"
    );
  });

  it("should search activities by muscle group", async () => {
    const fromSearch = await search(user.id, "%", "1____________%");
    expect(fromSearch[0]).to.deep.equal(activity);
  });

  it("should search activities by term", async () => {
    const fromSearch = await search(user.id, "%test%");
    expect(fromSearch[0]).to.deep.equal(activity);
  });
});
