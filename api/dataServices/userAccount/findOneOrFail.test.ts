import {
  getTestGlobalContext,
} from "../../config/db";

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
  await create(getTestGlobalContext(), {
    id: "here",
  });
  await expect(
    findOneOrFail(getTestGlobalContext(), (q) => q.where("id", "=", "here"))
  ).resolves.toEqual(expect.objectContaining({ id: "here" }));
});
