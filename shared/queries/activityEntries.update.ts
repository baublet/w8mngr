import gql from "graphql-tag";
import activityEntryParts from "./activityEntries.parts";

export default gql`
  mutation updateActivityEntry($id: Int, $reps: Int, $work: String) {
    updateActivityEntry(id: $id, reps: $reps, work: $work) {
      ${activityEntryParts}
    }
  }
`;
