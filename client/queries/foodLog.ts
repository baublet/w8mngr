import gql from "graphql-tag";
import foodEntryParts from "./foodEntry.parts";

export default gql`
  query foodEntries($days: [Int]){
    foodEntries(days: $days) {
      ${foodEntryParts}
    }
  }
`;
