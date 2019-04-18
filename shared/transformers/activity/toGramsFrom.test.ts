import toGramsFrom from "./toGramsFrom";
import { expect } from "chai";

describe("toGramsFrom", function() {
  it("should convert properly", async () => {
    const tests = [
      {
        num: 1,
        unit: "lb",
        expected: 453
      },
      {
        num: 1,
        unit: "kg",
        expected: 1000
      },
      {
        num: 1,
        unit: "stone",
        expected: 6350
      },
      {
        num: 20,
        unit: "stone",
        expected: 127005
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = await toGramsFrom(tests[i].num, tests[i].unit);
      expect(converted).to.equal(tests[i].expected);
    }
  });
});
