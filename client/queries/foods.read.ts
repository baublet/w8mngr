import gql from "graphql-tag";
import foodParts from "./foods.parts";

export default gql`
  query foodEntries($id: Int){
    foodEntries(id: $id) {
      ${foodParts}
    }
  }
`;
