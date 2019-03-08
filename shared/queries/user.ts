import gql from "graphql-tag";
import userParts from "shared/queries/user.parts";

export default gql`
  {
    user {
      ${userParts}
    }
  }
`;
