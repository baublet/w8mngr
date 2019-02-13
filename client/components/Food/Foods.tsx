import * as React from "react";
import Food from "components/Food/Food";
import { FoodType } from "../../../api/foods/types";
import EmptyNote from "components/Type/EmptyNote";

export interface FoodsProps {
  foods: Array<FoodType>;
}

export default function FoodLog(
  props: FoodsProps
): React.ReactComponentElement<any> {
  return (
    <>
      {!props.foods ? (
        <EmptyNote>You don't yet have any foods.</EmptyNote>
      ) : (
        props.foods.map((food, index) => (
          <Food {...food} key={food.id} index={index} />
        ))
      )}
    </>
  );
}
