import React from "react";
import cx from "classnames";

import { ActivityType, Muscle } from "../../generated";
import { activityTypeToHumanReadable } from "../../helpers";
import { MuscleMap } from "../MuscleMap";
import { MarkdownRenderer } from "../Markdown";
import { IntensityScale } from "./IntensityScale";

type ActivityProps = {
  description?: string | null;
  intensity: number;
  type: ActivityType;
  exrx?: string | null;
  muscleGroups: Muscle[];
};

export function ActivityDetails({
  activity: { description, intensity, type, exrx, muscleGroups },
}: {
  activity: ActivityProps;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row items-start gap-8 py-8 mb-8">
        <div className="flex flex-col px-12 mx-auto">
          <div className="w-48">
            <MuscleMap active={false} selected={muscleGroups} />
          </div>
        </div>

        <div className="flex flex-col justify-around border-t sm:border-t-0 border-slate-200 w-full pt-8 sm:pt-0">
          <div>
            <div className="flex items-center mt-2 gap-4">
              <div className="opacity-75 -ml-4">
                <IntensityScale intensity={intensity} />
              </div>
              <div className="text-5xl font-thin">{intensity}</div>
              <div className="flex flex-col">
                <div className="text-xs font-bold text-slate-400">/&nbsp;10</div>
                <SubHeader>intensity</SubHeader>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center mt-2">
              <div className="text-xl font-thin">
                {activityTypeToHumanReadable(type)}
              </div>
            </div>
            <SubHeader>type</SubHeader>
          </div>

          {exrx && (
            <div className="mt-4 opacity-75">
              <div className="flex items-center mt-2">
                <div className="text-xl font-thin">
                  <a href={exrx}>exrx.net link</a>
                </div>
              </div>
              <SubHeader>exrx</SubHeader>
            </div>
          )}
        </div>
      </div>

      {description && (
        <div className="mt-4">
          <MarkdownRenderer content={description} />
        </div>
      )}
    </div>
  );
}

function SubHeader({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cx("font-bold text-sm opacity-20", className)}>
      {children}
    </div>
  );
}
