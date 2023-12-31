import React from "react";

import { useGetPopularFoodsQuery } from "../../generated";
import { AddableFoods } from "./AddableFoods";
import { SideBarHeading } from "../Type/SideBarHeading";

export function PopularFoods({ day }: { day: string }) {
  const { data } = useGetPopularFoodsQuery({
    fetchPolicy: "cache-first",
  });

  const popularFoods = data?.currentUser?.popularFoods;

  if (!popularFoods) {
    return null;
  }

  return (
    <div>
      <SideBarHeading>Popular Foods</SideBarHeading>
      <div className="flex flex-col w-full gap-2">
        <AddableFoods
          day={day}
          foods={popularFoods}
          uniqueKey="popular-foods"
        />
      </div>
    </div>
  );
}
