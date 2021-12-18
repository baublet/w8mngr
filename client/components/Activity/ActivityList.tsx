import React from "react";

import { usePaginatedQuery } from "../../helpers";
import { useGetActivitiesQuery } from "../../generated";

import { PrimaryLoader } from "../Loading/Primary";
import { ActivityListItem } from "./ActivityListItem";
import { SystemOutlineButton } from "../Button/SystemOutline";
import { LeftIcon } from "../Icons/Left";
import { RightIcon } from "../Icons/Right";

export function ActivityList() {
  const {
    loading,
    nodes: activities,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePaginatedQuery(useGetActivitiesQuery, {
    perPage: 10,
    getConnection: (data) => data?.currentUser?.activities,
  });

  if (loading) {
    return <PrimaryLoader />;
  }

  return (
    <div className="flex flex-col gap-4">
      {activities.map((activity) => {
        return (
          <ActivityListItem
            key={activity.id}
            {...activity}
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
