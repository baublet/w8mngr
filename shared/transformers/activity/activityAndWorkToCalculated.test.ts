import convert from "./activityAndWorkToCalculated";
import { expect } from "chai";
import { ActivityTypeType, ActivityType } from "../../../api/activities/types";

const MockActivity = (props: any): ActivityType => {
  return Object.assign(
    {
      id: 0,
      activity_type: ActivityTypeType.DISTANCE,
      user_id: 0,
      name: "",
      description: "",
      muscle_groups: "",
      calories_formula: 0,
      popularity: 0,
      deleted: false,
      intensity: 0,
      created_at: "",
      updated_at: ""
    },
    props
  );
};

describe("activityAndWorkToCalculated", function() {
  it("should convert properly", async () => {
    const tests = [
      {
        activity: MockActivity({ activity_type: ActivityTypeType.DISTANCE }),
        toConvert: "0.5mi",
        expected: 804672
      },
      {
        activity: MockActivity({
          activity_type: ActivityTypeType.WEIGHTLIFTING
        }),
        toConvert: "20 stone",
        expected: 127005
      },
      {
        activity: MockActivity({ activity_type: ActivityTypeType.TIMED }),
        toConvert: "1m2s",
        expected: 62000
      },
      {
        activity: MockActivity({ activity_type: ActivityTypeType.REPETITIVE }),
        toConvert: "1m2s",
        expected: 0
      }
    ];
    for (let i = 0; i < tests.length; i++) {
      const converted = await convert(tests[i].activity, tests[i].toConvert);
      expect(converted).to.equal(tests[i].expected);
    }
  });
});
