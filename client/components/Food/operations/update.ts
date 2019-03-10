import { FoodFormState } from "client/components/Food/FoodForm";
import { MutationFn } from "react-apollo";
import { Dispatch, SetStateAction } from "react";

export default function updateFood(
  food: FoodFormState,
  setSaved: Dispatch<SetStateAction<boolean>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  updateFood: MutationFn
): void {
  updateFood({
    variables: food,
    update: () => {
      setSaved(true);
      setLoading(false);
    }
  });
}
