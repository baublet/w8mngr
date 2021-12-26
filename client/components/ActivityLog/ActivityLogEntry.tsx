import React from "react";
import cx from "classnames";

import {
  ActivityType,
  GetActivityLogDocument,
  useDeleteActivityLogMutation,
  useSaveActivityLogMutation,
} from "../../generated";
import { SHOW_REPS, WORK_LABELS } from "./NewActivityLogForm";

import { InputFoodEntry } from "../Forms";
import { DeleteIconButton } from "../Button/DeleteIconButton";
import { useForm, useToast } from "../../helpers";

export function ActivityLogEntry({
  log,
  activityType,
  activityId,
  day,
}: {
  activityId: string;
  activityType: ActivityType;
  day: string;
  log: {
    id: string;
    work?: Maybe<string>;
    reps?: Maybe<number>;
  };
}) {
  const { error, success } = useToast();
  const [deleted, setDeleted] = React.useState(false);
  const [deleteLog, { loading: deleteLoading }] = useDeleteActivityLogMutation({
    refetchQueries: [GetActivityLogDocument],
    onError: error,
  });
  const [saveLog, { loading: saveLoading }] = useSaveActivityLogMutation({
    onError: error,
    onCompleted: () => success("Log saved!"),
  });
  const formData = useForm<{ id: string; work: string; reps: string }>({
    initialValues: log,
  });
  const showReps = SHOW_REPS[activityType];
  const workLabel = WORK_LABELS[activityType];
  const handleDelete = React.useCallback(() => {
    setDeleted(true);
    success("Activity log deleted");
    deleteLog({
      variables: {
        id: log.id,
      },
    });
  }, [log.id]);
  const handleSave = React.useCallback(() => {
    saveLog({
      variables: {
        input: {
          activityId,
          day,
          activityLogs: [
            {
              id: log.id,
              work: formData.getValue("work", "0"),
              reps: formData.getValue("reps", "0"),
            },
          ],
        },
      },
    });
  }, [log.id]);

  if (deleted) {
    return null;
  }

  const loading = deleteLoading || saveLoading;

  return (
    <form
      className={cx(
        "group p-4 w-full flex gap-4 hover:bg-gray-50 items-center",
        {
          ["opacity-50 pointer-events-none"]: loading,
        }
      )}
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      {!showReps ? null : (
        <div className="w-full flex-grow-1">
          <InputFoodEntry
            defaultValue={formData.getValue("reps")}
            onChange={formData.getHandler("reps")}
            label="Reps"
            type="text"
          />
        </div>
      )}
      {!workLabel ? null : (
        <div className="w-full">
          <InputFoodEntry
            defaultValue={formData.getValue("work")}
            onChange={formData.getHandler("work")}
            label={workLabel}
            type="text"
          />
        </div>
      )}
      <div>
        <DeleteIconButton onClick={handleDelete} />
      </div>
      <button className="screen-reader-text" type="submit">
        Save
      </button>
    </form>
  );
}
