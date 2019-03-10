import { FoodFormState } from "client/components/Food/FoodForm";
import { MutationFn } from "react-apollo";
import readFoodQuery from "shared/queries/foods.read";
import foodsQuery from "shared/queries/foods";
import { History } from "history";

export default function createFood(
  food: FoodFormState,
  history: History,
  createFood: MutationFn
): void {
  createFood({
    variables: food,
    update: (proxy, { data: { createFood } }) => {
      if (!createFood || !createFood.id) {
        return;
      }
      const data: any = proxy.readQuery({
        query: foodsQuery
      });
      proxy.writeQuery({
        query: foodsQuery,
        data: {
          foods: [...data.foods, createFood]
        }
      });
      proxy.writeQuery({
        query: readFoodQuery,
        variables: { id: createFood.id },
        data: {
          food: createFood
        }
      });
      history.replace(`/food/${createFood.id}/edit`);
    }
  });
}
