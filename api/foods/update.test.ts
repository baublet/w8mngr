import create from "./create";
import update from "./update";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { FoodType } from "./types";

describe("Food: update", function() {
  let user: UserType, entity: FoodType;

  before(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    entity = await create(user.id, "Name", "Description");
  });

  it("should update food properly", async () => {
    const updated = await update(
      entity.id,
      user.id,
      "New Name",
      "New Description"
    );
    if (
      !updated ||
      !(updated.description == "New Description" && updated.name == "New Name")
    ) {
      return "Did not update properly!";
    }
  });
});
