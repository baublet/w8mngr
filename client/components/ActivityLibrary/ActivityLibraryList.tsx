import React from "react";

import { usePaginatedQuery } from "../../helpers/usePaginatedQuery";
import { useGetActivityLibraryActivitiesQuery } from "../../generated";

import { PrimaryLoader } from "../Loading/Primary";
import { ActivityListItem } from "../Activity/ActivityListItem";
import { SystemOutlineButton } from "../Button/SystemOutline";
import { LeftIcon } from "../Icons/Left";
import { RightIcon } from "../Icons/Right";

export function ActivityLibraryList({
  searchString,
}: {
  searchString?: string;
}) {
  const {
    loading,
    nodes: activities,
    nextPageLink,
    previousPageLink,
    hasNextPage,
    hasPreviousPage,
  } = usePaginatedQuery(useGetActivityLibraryActivitiesQuery, {
    perPage: 10,
    getConnection: (data) => data?.activityLibrary,
    filter: {
      searchString,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {loading && !activities.length && <PrimaryLoader />}
      {activities.map((activity) => {
        return (
          <ActivityListItem
            key={activity.id}
            url={`/activity-library/${activity.id}`}
            {...activity}
          />
        );
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
