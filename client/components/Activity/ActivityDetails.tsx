import React from "react";
import ReactMarkdown from "react-markdown";
import cx from "classnames";

import { ActivityType } from "../../generated";
import { activityTypeToHumanReadable } from "../../helpers";
import { MuscleMap } from "../MuscleMap";

type ActivityProps = {
  description?: string | null;
  intensity: number;
  type: ActivityType;
  exrx?: string | null;
};

export function ActivityDetails({
  activity: { description, intensity, type, exrx },
}: {
  activity: ActivityProps;
}) {
  return (
    <div className="flex flex-col">
      {description && (
        <div className="mt-4">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      )}

      <div className="flex border-t border-gray-100 mt-8 pt-4 items-start justify-between">
        <div className="flex flex-col justify-around">
          <div className="opacity-75">
            <SubHeader>intensity</SubHeader>
            <div className="flex items-center mt-2">
              <div className="text-5xl font-thin">{intensity}</div>
              <div className="text-xs ml-2 font-bold text-gray-400">
                /&nbsp;10
              </div>
            </div>
          </div>

          <div className="mt-4 opacity-75">
            <SubHeader>type</SubHeader>
            <div className="flex items-center mt-2">
              <div className="text-xl font-thin">
                {activityTypeToHumanReadable(type)}
              </div>
            </div>
          </div>

          {exrx && (
            <div className="mt-4 opacity-75">
              <SubHeader>exrx</SubHeader>
              <div className="flex items-center mt-2">
                <div className="text-xl font-thin">
                  <a href={exrx}>exrx.net link</a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col px-12">
          <SubHeader className="text-center">muscles targeted</SubHeader>
          <div className="h-80 mt-4">
            <MuscleMap />
          </div>
        </div>
      </div>
    </div>
  );
}

function SubHeader({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cx("font-bold text-sm opacity-50", className)}>
      {children}
    </div>
  );
}
