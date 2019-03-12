import gql from "graphql-tag";
import activityParts from "./activities.parts";

export default gql`
  query searchActivities($term: String, $muscle_groups: [String], $offset: Int, $limit: Int) {
    searchActivities(term: $term, muscle_groups: $muscle_groups, offset: $offset, limit: $limit)  {
      ${activityParts}
    }
  }
`;
