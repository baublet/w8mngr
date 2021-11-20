import { getTestGlobalContext } from "../../config/db";

import { create } from "./create";
import { findOneOrFail } from "./findOneOrFail";

it("throws if the user isn't found user account", async () => {
  await expect(
    findOneOrFail(getTestGlobalContext(), (q) => q.where("id", "=", "not-here"))
  ).rejects.toMatchInlineSnapshot(
    `[Error: UserEntity.findOneOrFail: user not found]`
  );
});

it("throws if the user isn't found user account", async () => {
  const created = await create(getTestGlobalContext(), {});
  await expect(
    findOneOrFail(getTestGlobalContext(), (q) => q.where("id", "=", created.id))
  ).resolves.toEqual(expect.objectContaining({ id: created.id }));
});
