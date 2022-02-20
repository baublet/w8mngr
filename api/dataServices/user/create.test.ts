import { getTestGlobalContext, usesDatabase } from "../../config/test";
import { create } from "./create";

usesDatabase();

it("creates a user", async () => {
  const user = await create(getTestGlobalContext(), {});
  expect(user).toEqual(expect.objectContaining({ id: expect.any(String) }));
});
