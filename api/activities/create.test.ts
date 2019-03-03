import create from "./create";
import createUser from "../user/create";
import count from "./countByUserId";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";

describe("Activity: create", function() {
  let user: UserType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
  });

  it("should create activity for the user", async () => {
    const firstCount = await count(user.id),
      created = await create(user.id, "Test Activity", "Description goes here"),
      secondCount = await count(user.id);
    if (!created || secondCount < firstCount) {
      return `Second count (${secondCount}) is not greater than first count (${firstCount}).`;
    }
  });
});
