import toMsFrom from "./toMsFrom";
import { expect } from "chai";

describe("toMsFrom", function() {
  it("should convert properly", async () => {
    const tests = [
      {
        num: 1,
        unit: "s",
        expected: 100
      },
      {
        num: 1,
        unit: "m",
        expected: 60000
      },
      {
        num: 1,
        unit: "h",
        expected: 60000 * 60
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = await toMsFrom(tests[i].num, tests[i].unit);
      expect(converted).to.equal(tests[i].expected);
    }
  });
});
