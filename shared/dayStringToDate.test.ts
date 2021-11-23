import { dayStringToDate } from "./dayStringToDate";

it("returns the right date", () => {
  expect(dayStringToDate("20211122")).toMatchInlineSnapshot(`2020-02-22T06:00:00.000Z`);
});
