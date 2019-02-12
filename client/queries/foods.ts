import gql from "graphql-tag";
import foodParts from "./foods.parts";

export default gql`
  query foods {
    foods {
      ${foodParts}
    }
  }
`;
