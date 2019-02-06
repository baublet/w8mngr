import shortDate from "./shortDate";

describe("ShortDate", function() {
  it("should return proper date", done => {
    const short = shortDate(new Date("July 20, 69 00:20:18"));
    if (short !== 19690720) {
      return done(`Expted short date ${short} to be 19690720.`);
    }
    done();
  });
});
