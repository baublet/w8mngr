import create from "./create";
import update from "./update";
import createUser from "../user/create";
import { clearDatabase } from "../../test/helpers";
import { UserType } from "../user/types";
import { FoodType } from "./types";

describe("Food: update", function() {
  let user: UserType, entity: FoodType;
  const day = 20180501;

  beforeEach(async () => {
    await clearDatabase();
    user = await createUser("testMan@test.com", "test password");
    entity = await create(user.id, "Name", "Description");
  });

  it("should update food properly", () => {
    return new Promise(async (resolve, reject) => {
      const updated = await update(
        entity.id,
        user.id,
        "New Name",
        "New Description"
      );
      if (
        updated &&
        (updated.description == "New Description" && updated.name == "New Name")
      ) {
        resolve();
      } else {
        resolve("Did not update properly!");
      }
    });
  });
});
