import { getTestGlobalContext } from "../../config/test";
import { create } from "./create";

it("creates a user", async () => {
  const userAccount = await create(getTestGlobalContext(), {});
  expect(userAccount).toEqual(
    expect.objectContaining({ id: expect.any(String) })
  );
});
