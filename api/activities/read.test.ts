import create from "./create";
import read from "./read";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { expect } from "chai";

describe("Activity: read", function() {
  let user: UserType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
  });

  it("should create activity for the user", async () => {
    const created = await create(
        user.id,
        "Test Activity",
        "Description goes here"
      ),
      fromRead = await read(created.id, user.id);

    expect(created).to.deep.equal(fromRead);
  });
});
