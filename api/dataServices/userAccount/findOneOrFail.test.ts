import { getTestGlobalContext } from "../../config/db";

import { create } from "./create";
import { findOneOrFail } from "./findOneOrFail";

it("throws if the user account isn't found user account", async () => {
  await expect(
    findOneOrFail(getTestGlobalContext(), (q) => q.where("id", "=", "not-here"))
  ).rejects.toMatchInlineSnapshot(
    `[Error: UserAccountEntity.findOneOrFail: user account not found]`
  );
});

it("returns the user account if we can find it", async () => {
  const user = await create(getTestGlobalContext());
  await expect(
    findOneOrFail(getTestGlobalContext(), (q) => q.where("id", "=", user.id))
  ).resolves.toEqual(expect.objectContaining({ id: user.id }));
});
