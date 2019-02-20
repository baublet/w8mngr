import { History } from "history";
import { MutationFn } from "react-apollo";
import { FoodType } from "api/foods/types";
import foodsQuery from "queries/foods";

export default function deleteFood(
  id: number,
  history: History,
  deleteFood: MutationFn
): void {
  history.replace("/foods");
  deleteFood({
    variables: { id: id },
    update: proxy => {
      // Read the data from our cache for this query.
      const data: any = proxy.readQuery({
        query: foodsQuery
      });
      proxy.writeQuery({
        query: foodsQuery,
        data: {
          foods: data.foods.filter((food: FoodType) => food.id !== id)
        }
      });
    }
  });
}
