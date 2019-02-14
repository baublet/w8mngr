import gql from "graphql-tag";

export default gql`
  mutation deleteFood($id: Int) {
    deleteFood(id: $id)
  }
`;
