import gql from "graphql-tag";
import activityParts from "./activities.parts";

export default gql`
  query activities {
    activities {
      ${activityParts}
    }
  }
`;
