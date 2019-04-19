import toMmFrom from "./toMmFrom";
import { expect } from "chai";

describe("toMmFrom", function() {
  it("should convert properly", async () => {
    const tests = [
      {
        num: 1,
        unit: "mi",
        expected: 1609344
      },
      {
        num: 5,
        unit: "k",
        expected: 5000000
      },
      {
        num: 40,
        unit: "yd",
        expected: 36576
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = await toMmFrom(tests[i].num, tests[i].unit);
      expect(converted).to.equal(tests[i].expected);
    }
  });
});
