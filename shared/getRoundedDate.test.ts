import { getRoundedDate } from "./getRoundedDate";

it.each`
  interval     | intervalAmount | inputDate                           | expectedDate
  ${"days"}    | ${1}           | ${new Date(2020, 0, 1, 12, 30)}     | ${new Date(2020, 0, 1)}
  ${"days"}    | ${3}           | ${new Date(2020, 0, 2)}             | ${new Date(2019, 11, 31)}
  ${"days"}    | ${3}           | ${new Date(2020, 0, 3)}             | ${new Date(2020, 0, 3)}
  ${"hours"}   | ${5}           | ${new Date(2020, 0, 1, 13)}         | ${new Date(2020, 0, 1, 10)}
  ${"hours"}   | ${5}           | ${new Date(2020, 0, 1, 15)}         | ${new Date(2020, 0, 1, 15)}
  ${"minutes"} | ${30}          | ${new Date(2020, 0, 1, 15, 31)}     | ${new Date(2020, 0, 1, 15, 30)}
  ${"minutes"} | ${30}          | ${new Date(2020, 0, 1, 16, 10)}     | ${new Date(2020, 0, 1, 16)}
  ${"seconds"} | ${30}          | ${new Date(2020, 0, 1, 16, 10, 30)} | ${new Date(2020, 0, 1, 16, 10, 30)}
  ${"seconds"} | ${30}          | ${new Date(2020, 0, 1, 16, 10, 29)} | ${new Date(2020, 0, 1, 16, 10)}
`(
  "$intervalAmount $interval rounds to the right $interval",
  ({ interval, intervalAmount, inputDate, expectedDate }) => {
    expect(
      getRoundedDate({
        date: inputDate,
        interval,
        intervalAmount,
      })
    ).toEqual(expectedDate);
  }
);
