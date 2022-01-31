import cx from "classnames";
import React from "react";

import {
  ActivityType,
  GetActivityLogDocument,
  useSaveActivityLogMutation,
} from "../../generated";
import { useForm, useToast } from "../../helpers";
import { PrimaryLightSaveButton } from "../Button/PrimaryLightSave";
import { PanelInverted } from "../Containers/PanelInverted";
import { InputInverted } from "../Forms";
import { Add } from "../Icons/Add";

export const WORK_LABELS: Record<ActivityType, string | false> = {
  DISTANCE: "Distance",
  REPETITIVE: false,
  TIMED: "Time",
  WEIGHT: "Weight",
};

export const WORK_PLACEHOLDERS: Record<ActivityType, string> = {
  DISTANCE: "e.g., 3 miles",
  REPETITIVE: "Reps",
  TIMED: "e.g., 20 minutes",
  WEIGHT: "e.g., 35 lbs",
};

export const SHOW_REPS: Record<ActivityType, boolean> = {
  DISTANCE: false,
  REPETITIVE: true,
  TIMED: false,
  WEIGHT: true,
};

export function NewActivityLogForm({
  activityId,
  activityType,
  day,
}: {
  activityId: string;
  activityType: ActivityType;
  day: string;
}) {
  const newActivityLogFormData = useForm<{
    reps: string;
    work: string;
  }>();
  const { success, error } = useToast();
  const [createActivityLog, { loading }] = useSaveActivityLogMutation({
    refetchQueries: [GetActivityLogDocument],
    awaitRefetchQueries: true,
    onCompleted: () => {
      newActivityLogFormData.clear();
      success("Log added");
    },
    onError: error,
  });

  const workLabel = WORK_LABELS[activityType];
  const showReps = SHOW_REPS[activityType];

  const create = React.useCallback(() => {
    const work = newActivityLogFormData.getValue("work", "0");
    const reps = newActivityLogFormData.getValue("reps", "0");

    createActivityLog({
      variables: {
        input: {
          activityId,
          day,
          activityLogs: [
            {
              reps,
              work,
            },
          ],
        },
      },
    });
  }, [activityType, activityId, day]);

  return (
    <div className="w-full">
      <PanelInverted className={cx({ "opacity-50": loading })}>
        <form
          className="flex gap-4"
          aria-disabled={loading}
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
        >
          <div className="flex gap-4 flex-grow w-full">
            {!showReps ? null : (
              <InputInverted
                focusOnFirstRender
                type="text"
                label="Reps"
                value={newActivityLogFormData.getValue("reps", "")}
                onChange={newActivityLogFormData.getHandler("reps")}
                placeholder="e.g., 10, or 3x10"
              />
            )}
            {!workLabel ? null : (
              <InputInverted
                focusOnFirstRender={!showReps}
                type="text"
                label={workLabel}
                value={newActivityLogFormData.getValue("work", "")}
                onChange={newActivityLogFormData.getHandler("work")}
                placeholder={WORK_PLACEHOLDERS[activityType]}
              />
            )}
          </div>
          <div className="flex-shrink">
            <PrimaryLightSaveButton
              type="submit"
              disabled={loading}
              leftIcon={<Add />}
            />
          </div>
        </form>
      </PanelInverted>
    </div>
  );
}
