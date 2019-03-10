import gql from "graphql-tag";
import activityParts from "./activities.parts";

export default gql`
  query activities($offset: Int, $limit: Int) {
    activities(offset: $offset, limit: $limit)  {
      ${activityParts}
    }
  }
`;
