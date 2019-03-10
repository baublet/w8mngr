import gql from "graphql-tag";
import foodParts from "./foods.parts";

export default gql`
  query foods($offset: Int, $limit: Int) {
    foods(offset: $offset, limit: $limit) {
      ${foodParts}
    }
  }
`;
