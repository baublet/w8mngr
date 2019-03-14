import calculateCalories from "./calculateCaloriesBurned";
import { expect } from "chai";

describe("CalculateCaloriesBurned", function() {
  it("should return a number", () => {
    const cases = [
      {
        args: {
          workWeightInGrams: 61235,
          reps: 10,
          intensity: 7,
          userWeightInGrams: 90718.5
        },
        expected: 21.62368111077874
      },
      {
        args: {
          workWeightInGrams: 61235,
          reps: 10,
          intensity: 3,
          userWeightInGrams: 90718.5
        },
        expected: 16.535756143536684
      },
      {
        args: {
          reps: 10,
          intensity: 3,
          userWeightInGrams: 90718.5
        },
        expected: 10
      },
      {
        args: {
          workDistanceInMm: 1.609e6,
          intensity: 3,
          userWeightInGrams: 90718.5
        },
        expected: 59.8547459720648
      },
      {
        args: {
          workTimeInMs: 4500,
          intensity: 1,
          userWeightInGrams: 90718.5
        },
        expected: 7.499993230125007
      },
      {
        args: {
          workTimeInMs: 2000,
          intensity: 10,
          userWeightInGrams: 90718.5
        },
        expected: 20
      }
    ];
    for (let i = 0; i < cases.length; i++) {
      expect(calculateCalories(cases[i].args)).to.equal(cases[i].expected);
    }
  });
});
