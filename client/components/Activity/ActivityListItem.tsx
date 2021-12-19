import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import { ItemHeading } from "../Type/ItemHeading";
import { MarkdownRenderer } from "../Markdown";
import { MuscleMap } from "../MuscleMap";
import { ActivityType, Muscle } from "../../generated";
import { activityTypeToHumanReadable } from "../../helpers";

export function ActivityListItem({
  id,
  name,
  description,
  muscleGroups,
  type,
}: {
  id: string;
  name: string;
  description?: string | null;
  muscleGroups: Muscle[];
  type: ActivityType;
}) {
  const [showAll, setShowAll] = React.useState(false);

  return (
    <div
      className={`
hover:bg-gray-50
hover:bg-opacity-50
border
border-transparent
border-gray-100
hover:border-gray-100
rounded
p-4
    `}
    >
      <div
        className={`
flex
flex-col
w-full
`}
      >
        <Link
          to={`/activities/${id}`}
          className="flex w-full justify-start items-center text-left"
          title={`Edit Activity: ${name}`}
        >
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col flex-grow">
              <ItemHeading>{name}</ItemHeading>
              <div className="text-sm uppercase opacity-50 mt-2">
                {activityTypeToHumanReadable(type)}
              </div>
              {description && (
                <div className="block mt-2 text-gray-700 text-opacity-80 leading-tight">
                  <MarkdownRenderer
                    content={description}
                    maxLength={240}
                    textOnly
                  />
                </div>
              )}
            </div>
            <div className="flex-shrink w-32">
              <MuscleMap selected={muscleGroups} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
