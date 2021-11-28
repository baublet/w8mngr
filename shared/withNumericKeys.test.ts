import { withNumericKeys } from "./withNumericKeys";

it("turns certain keys numeric", () => {
  expect(
    withNumericKeys(
      {
        id: "1",
        str: "string",
        uhOh: "string!",
      },
      ["id", "uhOh"]
    )
  ).toEqual({
    id: 1,
    str: "string",
    uhOh: 0,
  });
});
