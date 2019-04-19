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
        expected: 3657
      },
      {
        toConvert: "3",
        expected: 4828032
      },
      {
        toConvert: "12yd",
        expected: 10972
      },
      {
        toConvert: "5k",
        expected: 5000000
      },
      {
        toConvert: "1 marathon",
        expected: 42195068
      },
      {
        toConvert: "3 marathons",
        expected: 126585204
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = await convert(tests[i].toConvert);
      expect(converted).to.equal(tests[i].expected);
    }
  });
});
