import dateFromShortDate from "./dateFromShortDate";

describe("DateFromShortDate", function() {
  it("should return proper date object", async () => {
    const dateObj = dateFromShortDate(20190202);
    if (dateObj.getFullYear() !== 2019) {
      return `Expected year to be 2019. Was instead ${dateObj.getFullYear()}`;
    }
    if (dateObj.getMonth() !== 1) {
      return `Expected month to be February (1, JS indexes months at 0). Was instead ${dateObj.getMonth()}`;
    }
    if (dateObj.getDate() !== 2) {
      return `Expected day to be 2. Was instead ${dateObj.getDate()}`;
    }
  });
});
