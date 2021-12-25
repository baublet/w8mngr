import React from "react";

import {
  useSaveActivityLogMutation,
  ActivityType,
} from "../../generated";
import { useForm, useToast } from "../../helpers";

import { Add } from "../Icons/Add";
import { SecondaryIconButton } from "../Button/SecondaryIcon";
import { PanelInverted } from "../Containers/PanelInverted";
import { InputInverted } from "../Forms";

const WORK_LABELS: Record<ActivityType, string | false> = {
  DISTANCE: "Distance",
  REPETITIVE: false,
  TIMED: "Time",
  WEIGHT: "Weight",
};

const SHOW_REPS: Record<ActivityType, boolean> = {
  DISTANCE: false,
  REPETITIVE: true,
  TIMED: false,
  WEIGHT: true,
};

export function NewActivityLogForm({
  activityType,
}: {
  activityType: ActivityType;
}) {
  const newActivityLogFormData = useForm<{
    reps: string;
    work: string;
  }>();
  const { success, error } = useToast();
  const [createActivityLog] = useSaveActivityLogMutation({
    onCompleted: () => {
      success("Log added");
    },
    onError: error,
  });

  const workLabel = WORK_LABELS[activityType];
  const showReps = SHOW_REPS[activityType];

  const create = React.useCallback(() => {
    
    createActivityLog()
  },[])

  return (
    <div className="w-96">
      <PanelInverted>
        <div className="flex gap-4">
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
          <SecondaryIconButton>
            <Add />
          </SecondaryIconButton>
        </div>
      </PanelInverted>
    </div>
  );
}
