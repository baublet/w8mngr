import gql from "graphql-tag";
import activitiesParts from "./activities.parts";

export default gql`
mutation updateActivity(
  $id: Int
  $name: String
  $description: String
  $exrx: String
  $activity_type: Int
  $muscle_groups: String
  $intensity: Int
) {
  updateActivity(
    id: $id
    name: $name
    description: $description
    exrx: $exrx
    activity_type: $activity_type
    muscle_groups: $muscle_groups
    intensity: $intensity
  ) {
    ${activitiesParts}
  }
}
`;
