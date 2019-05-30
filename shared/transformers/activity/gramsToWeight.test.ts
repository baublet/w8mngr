import gramsToWeight from "./gramsToWeight";
import weightToGrams from "./weightToGrams";
import { expect } from "chai";

describe("weightToGrams", function() {
  it("should convert properly to lb", async () => {
    const tests = [
      {
        toConvert: 4536,
        expected: "10 lb"
      },
      {
        toConvert: await weightToGrams("45 lb"),
        expected: "45 lb"
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = gramsToWeight(tests[i].toConvert);
      expect(converted).to.equal(tests[i].expected);
    }
  });

  it("should convert properly to kg", async () => {
    const tests = [
      {
        toConvert: 1000,
        expected: "1 kg"
      },
      {
        toConvert: await weightToGrams("20 kg"),
        expected: "20 kg"
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = gramsToWeight(tests[i].toConvert, "kg");
      expect(converted).to.equal(tests[i].expected);
    }
  });

  it("should convert properly to stone", async () => {
    const tests = [
      {
        toConvert: 6350,
        expected: "1 stone"
      },
      {
        toConvert: await weightToGrams("20 stone"),
        expected: "20 stone"
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = gramsToWeight(tests[i].toConvert, "stone");
      expect(converted).to.equal(tests[i].expected);
    }
  });
});
