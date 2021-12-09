import React from "react";

import { usePaginatedQuery } from "../../helpers";
import { useGetFoodsQuery } from "../../generated";

import { PrimaryLoader } from "../Loading/Primary";
import { FoodsListItem } from "./FoodListItem";
import { SystemOutlineButton } from "../Button/SystemOutline";
import { LeftIcon } from "../Icons/Left";
import { RightIcon } from "../Icons/Right";

export function FoodsList() {
  const {
    loading,
    nodes: foods,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePaginatedQuery(useGetFoodsQuery, {
    perPage: 10,
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
          <SystemOutlineButton
            onClick={previousPage}
            disabled={!hasPreviousPage}
            leftIcon={<LeftIcon />}
          >
            Back
          </SystemOutlineButton>
        </div>
        <div className="justify-right">
          <SystemOutlineButton
            onClick={nextPage}
            disabled={!hasNextPage}
            rightIcon={<RightIcon />}
          >
            Next
          </SystemOutlineButton>
        </div>
      </div>
    </div>
  );
}
