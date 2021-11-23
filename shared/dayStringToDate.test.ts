import { dayStringToDate } from "./dayStringToDate";

it("returns the right date", () => {
  const date = dayStringToDate("20211122");
  expect(date.toISOString()).toContain("2021-11-22");
});
