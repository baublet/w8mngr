import { dayStringToDate } from "./dayStringToDate.js";

it.each([
  ["20211122", "2021-11-22"],
  ["20201031", "2020-10-31"],
])("for %s returns date object on %s", (day, expected) => {
  const date = dayStringToDate(day);
  expect(date.toISOString()).toContain(expected);
});
