import setCharAt from "./setCharAt";

describe("SetCharAt", function() {
  it("should return proper date", () => {
    if (setCharAt("010", 1, "0") != "000") {
      return `Expected setCharAt to be "000". Was instead ${setCharAt(
        "010",
        1,
        "0"
      )}`;
    }
  });
});
