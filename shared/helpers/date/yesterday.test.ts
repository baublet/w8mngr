import yesterday from "./yesterday";

describe("Yesterday", function() {
  it("should return proper date for yesterday", done => {
    const date = new Date("August 19, 1975 23:15:30"),
      yesterdayShort = yesterday(date);
    if (yesterdayShort !== 19750818) {
      return done(
        `Expected yesterday to be 19750818, was instead ${yesterdayShort}`
      );
    }
    done();
  });
  it("should return proper date for yesterday when on month borderline", done => {
    const date = new Date("May 1, 2020"),
      yesterdayShort = yesterday(date);
    if (yesterdayShort !== 20200430) {
      return done(
        `Expected yesterday to be 20200430, was instead ${yesterdayShort}`
      );
    }
    done();
  });
  it("should return proper date for yesterday when on year borderline", done => {
    const date = new Date("January 1, 2021"),
      yesterdayShort = yesterday(date);
    if (yesterdayShort !== 20201231) {
      return done(
        `Expected yesterday to be 20201231, was instead ${yesterdayShort}`
      );
    }
    done();
  });
});
