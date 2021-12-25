import React from "react";

import { ActivityType } from "../../generated";
import { SHOW_REPS, WORK_LABELS } from "./NewActivityLogForm";

import { InputFoodEntry } from "../Forms";
import { useForm } from "../../helpers";

export function ActivityLogEntry({
  log,
  activityType,
}: {
  activityType: ActivityType;
  log: {
    id: string;
    work?: Maybe<string>;
    reps?: Maybe<number>;
  };
}) {
  const formData = useForm<{ id: string; work: string; reps: string }>({
    initialValues: log,
  });
  const showReps = SHOW_REPS[activityType];
  const workLabel = WORK_LABELS[activityType];

  return (
    <div className="flex gap-4 hover:bg-gray-50">
      {!showReps ? null : (
        <InputFoodEntry
          defaultValue={formData.getValue("reps")}
          onChange={formData.getHandler("reps")}
          label="Reps"
          type="text"
        />
      )}
      {!workLabel ? null : (
        <InputFoodEntry
          defaultValue={formData.getValue("work")}
          onChange={formData.getHandler("work")}
          label={workLabel}
          type="text"
        />
      )}
    </div>
  );
}
