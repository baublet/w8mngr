import gql from "graphql-tag";
import foodParts from "./foods.parts";

export default gql`
  query searchFoods($term: String, $limit: Int, $offset: Int) {
    searchFoods(term: $term, limit: $limit, offset: $offset) {
      ${foodParts}
    }
  }
`;
