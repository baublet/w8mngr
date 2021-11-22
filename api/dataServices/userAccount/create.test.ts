import { getTestGlobalContext } from "../../config/db";

import { create } from "./create";

it("creates a user account", async () => {
  const userAccount = await create(getTestGlobalContext(), {});
  expect(userAccount).toEqual(
    expect.objectContaining({ id: expect.any(String), source: "local" })
  );
});