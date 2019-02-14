import gql from "graphql-tag";
import foodParts from "./foods.parts";

export default gql`
  query food($id: Int){
    food(id: $id) {
      ${foodParts}
    }
  }
`;
