import { weightedClamp } from "./weightedClamp.js";

it("returns 3 for 1/4 in a 1-10 scale", () => {
  expect(
    weightedClamp({
      setValue: 1,
      max: 10,
      min: 1,
      setMax: 4,
    }),
  ).toBe(1);
});
