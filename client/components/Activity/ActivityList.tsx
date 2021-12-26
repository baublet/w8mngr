import React from "react";

import { usePaginatedQuery } from "../../helpers";
import { useGetActivitiesQuery } from "../../generated";

import { PrimaryLoader } from "../Loading/Primary";
import { ActivityListItem } from "./ActivityListItem";
import { SystemOutlineButton } from "../Button/SystemOutline";
import { LeftIcon } from "../Icons/Left";
import { RightIcon } from "../Icons/Right";

export function ActivityList({ searchString }: { searchString?: string }) {
  const {
    loading,
    nodes: activities,
    nextPageLink,
    previousPageLink,
    hasNextPage,
    hasPreviousPage,
  } = usePaginatedQuery(useGetActivitiesQuery, {
    perPage: 10,
    getConnection: (data) => data?.currentUser?.activities,
    filter: {
      searchString,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {loading && <PrimaryLoader />}
      {activities.map((activity) => {
        return <ActivityListItem key={activity.id} {...activity} />;
      })}
      <div className="flex justify-between">
        <div className="flex-grow flex">
          <SystemOutlineButton
            to={previousPageLink}
            disabled={!hasPreviousPage}
            leftIcon={<LeftIcon />}
          >
            Back
          </SystemOutlineButton>
        </div>
        <div className="justify-right">
          <SystemOutlineButton
            to={nextPageLink}
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
