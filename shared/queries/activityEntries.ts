import gql from "graphql-tag";
import activityEntryParts from "./activityEntries.parts";

export default gql`
  query activityEntries($activityId: Int, $day: Int) {
    activityEntries(activityId: $activityId, day: $day) {
      ${activityEntryParts}
    }
  }
`;
