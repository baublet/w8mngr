import convert from "./distanceToMm";
import { expect } from "chai";

describe("distanceToMm", function() {
  it("should convert properly", async () => {
    const tests = [
      {
        toConvert: "0.5mi",
        expected: 804672
      },
      {
        toConvert: "12 feet",
        expected: 3658
      },
      {
        toConvert: "3",
        expected: 4828032
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = await convert(tests[i].toConvert);
      expect(converted).to.equal(tests[i].expected);
    }
  });
});
