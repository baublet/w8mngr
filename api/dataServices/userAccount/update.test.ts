import { getTestGlobalContext } from "../../config/db";

import { create } from "./create";
import { findOneOrFail } from "./findOneOrFail";
import { update } from "./update";

it("updates the record", async () => {
  await create(getTestGlobalContext(), {
    id: "here",
  });
  await update(getTestGlobalContext(), (q) => q.where("id", "=", "here"), {
    userId: "updated user id",
  });

  await expect(
    findOneOrFail(getTestGlobalContext(), (q) => {
      q.where("id", "=", "here");
    })
  ).resolves.toEqual(
    expect.objectContaining({ id: "here", userId: "updated user id" })
  );
});
