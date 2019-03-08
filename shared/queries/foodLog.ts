import gql from "graphql-tag";
import foodEntryParts from "./foodEntry.parts";

export default gql`
  query foodEntries($day: Int) {
    foodEntries(day: $day) {
      ${foodEntryParts}
    }
  }
`;
