import setCharAt from "./setCharAt";

describe("SetCharAt", function() {
  it("should properly set a character at a specific index", () => {
    if (setCharAt("010", 1, "0") != "000") {
      return `Expected setCharAt to be "000". Was instead ${setCharAt(
        "010",
        1,
        "0"
      )}`;
    }
  });
});
