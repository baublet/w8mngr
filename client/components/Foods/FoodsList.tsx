import React from "react";

import { usePaginatedQuery } from "../../helpers";
import { useGetFoodsQuery } from "../../generated";

import { PrimaryLoader } from "../Loading/Primary";
import { FoodsListItem } from "./FoodListItem";
import { SecondaryButton } from "../Button/Secondary";

export function FoodsList() {
  const {
    loading,
    nodes: foods,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePaginatedQuery(useGetFoodsQuery, {
    getConnection: (data) => data?.currentUser?.foods,
  });

  if (loading) {
    return <PrimaryLoader />;
  }

  return (
    <div className="flex flex-col gap-4">
      {foods.map((food) => {
        return (
          <FoodsListItem
            key={food.id}
            {...food}
            previewImageUrl={food.image?.previewImageUrl}
          />
        );
      })}
      <div className="flex justify-between">
        <div className="flex-grow">
          <SecondaryButton onClick={previousPage} disabled={!hasPreviousPage}>
            Previous
          </SecondaryButton>
        </div>
        <div className="justify-right">
          <SecondaryButton onClick={nextPage} disabled={!hasNextPage}>
            Next
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
