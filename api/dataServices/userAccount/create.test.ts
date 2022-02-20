import { getTestGlobalContext, usesDatabase } from "../../config/test";
import { create } from "./create";

usesDatabase();

it("creates a user account", async () => {
  const userAccount = await create(getTestGlobalContext(), {});
  expect(userAccount).toEqual(
    expect.objectContaining({ id: expect.any(String), source: "local" })
  );
});
