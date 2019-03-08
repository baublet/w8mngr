import gql from "graphql-tag";

export default gql`
  mutation deleteMeasurement($id: Int, $food_id: Int) {
    deleteMeasurement(id: $id, food_id: $food_id)
  }
`;
