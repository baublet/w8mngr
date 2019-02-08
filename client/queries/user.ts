import gql from "graphql-tag";
import userParts from "queries/user.parts";

export default gql`
  {
    user {
      ${userParts}
    }
  }
`;
