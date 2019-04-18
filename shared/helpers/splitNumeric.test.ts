import splitNumeric from "./splitNumeric";

describe("SplitNumeric", function() {
  it("should properly split strings when numeric changes", done => {
    [
      ["12 lb", [12, "lb"]],
      ["12 kg", [12, "kg"]],
      ["10.3stone", [10.3, "stone"]],
      ["10.3st", [10.3, "st"]],
      ["10.5", [10.5, ""]],
      ["lb", [0, "lb"]],
      ["", [0, ""]]
    ].forEach(test => {
      const ret = splitNumeric(`${test[0]}`);
      if (test[1][0] == ret[0] && test[1][1] == ret[1]) {
        return;
      }
      throw new Error(
        `Expected ${test[1][0]} == ${ret[0]} AND ${test[1][1]} == ${ret[1]}`
      );
    });
    done();
  });
});
