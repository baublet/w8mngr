import tomorrow from "./tomorrow";

describe("Tomorrow", function() {
  it("should return proper date for tomorrow", done => {
    const date = new Date("August 19, 1975 23:15:30"),
      tomorrowShort = tomorrow(date);
    if (tomorrowShort !== 19750820) {
      return done(
        `Expected tomorrow to be 19750820, was instead ${tomorrowShort}`
      );
    }
    done();
  });
  it("should return proper date for tomorrow when on month borderline", done => {
    const date = new Date("April 30, 2020"),
      tomorrowShort = tomorrow(date);
    if (tomorrowShort !== 20200501) {
      return done(
        `Expected tomorrow to be 20200501, was instead ${tomorrowShort}`
      );
    }
    done();
  });
  it("should return proper date for tomorrow when on year borderline", done => {
    const date = new Date("December 31, 2020"),
      tomorrowShort = tomorrow(date);
    if (tomorrowShort !== 20210101) {
      return done(
        `Expected tomorrow to be 20210101, was instead ${tomorrowShort}`
      );
    }
    done();
  });
});
