import convert from "./msTotime";
import { expect } from "chai";

describe("msTotime", function() {
  it("should convert properly", async () => {
    const tests = [
      {
        toConvert: 120000,
        expected: "2m"
      },
      {
        toConvert: 1000 * 60 * 60 * 2,
        expected: "2h"
      },
      {
        toConvert: 1000 * 60 * 60 * 2 + 1000 * 60 * 2,
        expected: "2h2m"
      },
      {
        toConvert: 1000 * 60 * 60 * 2 + 1000 * 60 * 2 + 1000 * 2,
        expected: "2h2m2s"
      },
      {
        toConvert: 1000 * 60 * 60 * 2 + 1000 * 60 * 2 + 1000 * 2 + 2,
        expected: "2h2m2s2ms"
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = await convert(tests[i].toConvert);
      expect(converted).to.equal(tests[i].expected);
    }
  });
});
