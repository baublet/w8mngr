import React from "react";
import { Link } from "react-router-dom";

import { ActivityType, Muscle } from "../../generated";
import { activityTypeToHumanReadable } from "../../helpers/activityTypeToHumanReadable";
import { Panel } from "../Containers/Panel";
import { AsyncMarkdown } from "../Markdown";
import { MuscleMap } from "../MuscleMap";
import { ItemHeading } from "../Type/ItemHeading";
import { IntensityScale } from "./IntensityScale";

export function ActivityListItem({
  id,
  name,
  description,
  muscleGroups,
  type,
  intensity,
}: {
  id: string;
  name: string;
  description?: string | null;
  muscleGroups: Muscle[];
  type: ActivityType;
  intensity: number;
}) {
  return (
    <Panel>
      <div
        className={`
          flex
          flex-col
          w-full`}
      >
        <Link
          to={`/activities/${id}`}
          className="flex w-full justify-start items-center text-left group"
          title={`Edit Activity: ${name}`}
        >
          <div className="flex w-full items-center gap-4">
            <div className="flex w-full flex-col flex-grow gap-4">
              <ItemHeading>{name}</ItemHeading>
              <div className="flex items-start gap-2">
                <div className="opacity-75 group-hover:opacity-100">
                  <IntensityScale intensity={intensity} size="tiny" />
                </div>
                <div className="text-sm uppercase opacity-40 group-hover:opacity-60 leading-tight">
                  {activityTypeToHumanReadable(type)}
                </div>
              </div>
              {description && (
                <div className="block text-slate-700 text-opacity-80 leading-tight">
                  <AsyncMarkdown
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
    </Panel>
  );
}
