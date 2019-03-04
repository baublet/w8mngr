import gql from "graphql-tag";
import activitiesParts from "./activities.parts";

export default gql`
query activity($id: Int) {
  activity(id: $id) {
    ${activitiesParts}
  }
}
`;
