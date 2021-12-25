import React from "react";
import cx from "classnames";

import {
  useSaveActivityLogMutation,
  ActivityType,
  GetActivityLogDocument,
} from "../../generated";
import { useForm, useToast } from "../../helpers";

import { Add } from "../Icons/Add";
import { SecondaryIconButton } from "../Button/SecondaryIcon";
import { PanelInverted } from "../Containers/PanelInverted";
import { InputInverted } from "../Forms";

export const WORK_LABELS: Record<ActivityType, string | false> = {
  DISTANCE: "Distance",
  REPETITIVE: false,
  TIMED: "Time",
  WEIGHT: "Weight",
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
    onCompleted: () => {
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
  }, [activityType, activityId]);

  return (
    <div className="w-96">
      <PanelInverted className={cx({ "opacity-50": loading })}>
        <form
          className="flex gap-4"
          aria-disabled={loading}
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
        >
          {!showReps ? null : (
            <InputInverted
              focusOnFirstRender
              type="text"
              label="Reps"
              defaultValue={newActivityLogFormData.getValue("reps")}
              onChange={newActivityLogFormData.getHandler("reps")}
              placeholder=""
            />
          )}
          {!workLabel ? null : (
            <InputInverted
              focusOnFirstRender={!showReps}
              type="text"
              label={workLabel}
              defaultValue={newActivityLogFormData.getValue("work")}
              onChange={newActivityLogFormData.getHandler("work")}
              placeholder=""
            />
          )}
          <SecondaryIconButton type="submit" disabled={loading}>
            <Add />
          </SecondaryIconButton>
        </form>
      </PanelInverted>
    </div>
  );
}
