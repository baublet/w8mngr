import leftPad from "./leftPad";

describe("LeftPad", function() {
  it("should return proper date", done => {
    if (leftPad(0) != "00") {
      return done(`Expected leftPad of 0 to be 00. Was instead ${leftPad(0)}`);
    }
    done();
  });
});
