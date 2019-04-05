import gql from "graphql-tag";

export default gql`
  mutation deleteActivityEntry($id: Int) {
    deleteActivityEntry(id: $id)
  }
`;
