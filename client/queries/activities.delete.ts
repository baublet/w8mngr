import gql from "graphql-tag";

export default gql`
  mutation deleteActivity($id: Int) {
    deleteActivity(id: $id)
  }
`;
