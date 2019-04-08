import gql from "graphql-tag";
import activityEntryParts from "./activityEntries.parts";

export default gql`
  mutation createActivityEntry($activityId: Int, $day: Int, $reps: Int, $work: String) {
    createActivityEntry(activityId: $activityId, day: $day, reps: $reps, work: $work) {
      ${activityEntryParts}
    }
  }
`;
