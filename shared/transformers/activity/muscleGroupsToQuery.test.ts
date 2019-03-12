import muscleGroupsToQuery from "./muscleGroupsToQuery";

describe("MuscleGroupsToQuery", function() {
  it("should return proper string", () => {
    let groups = muscleGroupsToQuery(["biceps", "quads"]);
    if (groups != "1____________1?") {
      return `Expected ${groups} to be 1____________1?`;
    }

    groups = muscleGroupsToQuery([
      "biceps",
      "deltoids",
      "forearms",
      "triceps",
      "trapezius",
      "lats",
      "abs",
      "obliques",
      "pectorals",
      "adductors",
      "calves",
      "hamstrings",
      "glutes",
      "quads"
    ]);
    if (groups != "11111111111111?") {
      return `Expected ${groups} to be 1____________1?`;
    }
  });
});
