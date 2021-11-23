import { getTestGlobalContext } from "../../config/db";

import { create } from "./create";
import { findOneOrFail } from "./findOneOrFail";
import { update } from "./update";

it("updates the record", async () => {
  const user = await create(getTestGlobalContext());
  await update(getTestGlobalContext(), (q) => q.where("id", "=", user.id), {
    userId: "updated user id",
  });

  await expect(
    findOneOrFail(getTestGlobalContext(), (q) => {
      q.where("id", "=", user.id);
    })
  ).resolves.toEqual(
    expect.objectContaining({ id: user.id, userId: "updated user id" })
  );
});
