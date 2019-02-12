import gql from "graphql-tag";
import userParts from "./user.parts";

const registerQuery = gql`
  mutation register($email: String, $password: String) {
    register(email: $email, password: $password) {
      user {
        ${userParts}
      }
      token
    }
  }
`;

export default registerQuery;
