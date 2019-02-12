import gql from "graphql-tag";

export default gql`
  mutation deleteFoodEntry($id: Int) {
    deleteFoodEntry(id: $id)
  }
`;
