import convert from "./timeToMs";
import { expect } from "chai";

describe("timeToMs", function() {
  it("should convert properly", async () => {
    const tests = [
      {
        toConvert: "2min",
        expected: 120000
      },
      {
        toConvert: "3 hrs",
        expected: 10800000
      },
      {
        toConvert: "300",
        expected: 300
      },
       {
         toConvert: '1m2s',
         expected: 62000
       }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = await convert(tests[i].toConvert);
      expect(converted).to.equal(tests[i].expected);
    }
  });
});
