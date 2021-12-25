import React from "react";
import cx from "classnames";

import { ActivityType, useDeleteActivityLogMutation } from "../../generated";
import { SHOW_REPS, WORK_LABELS } from "./NewActivityLogForm";

import { InputFoodEntry } from "../Forms";
import { DeleteIconButton } from "../Button/DeleteIconButton";
import { useForm, useToast } from "../../helpers";

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
  const { error, success } = useToast();
  const [deleted, setDeleted] = React.useState(false);
  const [deleteLog, { loading }] = useDeleteActivityLogMutation({
    onCompleted: () => success("Activity log deleted"),
    onError: error,
  });
  const formData = useForm<{ id: string; work: string; reps: string }>({
    initialValues: log,
  });
  const showReps = SHOW_REPS[activityType];
  const workLabel = WORK_LABELS[activityType];
  const handleDelete = React.useCallback(() => {
    setDeleted(true);
    deleteLog({
      variables: {
        id: log.id,
      },
    });
  }, [log.id]);

  if (deleted) {
    return null;
  }

  return (
    <form
      className={cx("flex gap-4 hover:bg-gray-50", {
        ["opacity-50 pointer-events-none"]: loading,
      })}
      onSubmit={(e) => {
        e.preventDefault();
        handleDelete();
      }}
    >
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
    </form>
  );
}
