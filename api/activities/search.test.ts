import create from "./create";
import search from "./search";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { expect } from "chai";

describe("Activity: search", function() {
  let user: UserType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
  });

  it("should search activities", async () => {
    const created = await create(
        user.id,
        "Test Activity",
        "Description goes here",
        "",
        0,
        "10000000000000"
      ),
      fromSearch = await search(user.id, "%", "1____________%");
    expect(fromSearch[0]).to.deep.equal(created);
  });
});
