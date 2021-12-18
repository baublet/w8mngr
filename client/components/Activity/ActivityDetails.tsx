import React from "react";
import ReactMarkdown from "react-markdown";

import { ActivityType } from "../../generated";
import { activityTypeToHumanReadable } from "../../helpers";

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
        <div className="mb-4">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      )}
      <div className="flex flex-col justify-around border-t border-gray-100 mt-24">
        <div className="mt-4 opacity-75">
          <div className="font-bold text-xs">
            intensity
          </div>
          <div className="flex items-center mt-2">
            <div className="text-5xl font-thin">{intensity}</div>
            <div className="text-xs ml-2 font-bold text-gray-400">
              /&nbsp;10
            </div>
          </div>
        </div>

        <div className="mt-4 opacity-75">
          <div className="font-bold text-xs">
            type
          </div>
          <div className="flex items-center mt-2">
            <div className="text-xl font-thin">
              {activityTypeToHumanReadable(type)}
            </div>
          </div>
        </div>

        {exrx && (
          <div className="mt-4 opacity-75">
            <div className="font-bold text-xs">
              exrx
            </div>
            <div className="flex items-center mt-2">
              <div className="text-xl font-thin">
                <a href={exrx}>exrx.net link</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
