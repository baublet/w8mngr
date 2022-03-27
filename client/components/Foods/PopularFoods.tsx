import React from "react";

import { useGetPopularFoodsQuery } from "../../generated";
import { FoodsListItem } from "./FoodListItem";
import { PanelHeading } from "../Type/PanelHeading";
import { AddableFoods } from "./AddableFoods";

export function PopularFoods({ day }: { day: string }) {
  const { data } = useGetPopularFoodsQuery();

  const popularFoods = data?.currentUser?.popularFoods;

  if (!popularFoods) {
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <AddableFoods day={day} foods={popularFoods} uniqueKey="popular-foods" />
    </div>
  );
}
