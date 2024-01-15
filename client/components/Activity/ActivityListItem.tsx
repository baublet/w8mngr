import React from "react";
import { Link } from "wouter";

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
  url = `/activities/${id}`,
}: {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  muscleGroups: Muscle[];
  type?: ActivityType | null;
  intensity?: number | null;
  url?: string;
}) {
  return (
    <Panel>
      <div
        className={`
          flex
          flex-col+
          w-full`}
      >
        <Link
          to={url}
          className="flex w-full justify-start items-center text-left group"
          title={`Edit Activity: ${name}`}
        >
          <div className="flex w-full items-center gap-4 cursor-pointer">
            <div className="flex w-full flex-col flex-grow gap-4 pointer-events-none">
              <ItemHeading>{name}</ItemHeading>
              <div className="flex items-start gap-2">
                <div className="opacity-75 group-hover:opacity-100">
                  <IntensityScale intensity={intensity || 0} size="tiny" />
                </div>
                <div className="text-sm uppercase opacity-40 group-hover:opacity-60 leading-tight">
                  {activityTypeToHumanReadable(type || "WEIGHT")}
                </div>
              </div>
              {description && (
                <div
                  className="block text-slate-700 text-opacity-80 leading-tight"
                  style={{ minHeight: "67.5px" }}
                >
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
