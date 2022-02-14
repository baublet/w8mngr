import cx from "classnames";
import React from "react";

import { or } from "../../../shared";
import { Maybe } from "../../../shared/types";
import {
  ActivityType,
  GetActivityLogDocument,
  useDeleteActivityLogMutation,
  useSaveActivityLogMutation,
} from "../../generated";
import { useForm, useToast } from "../../helpers";
import { DeleteIconButton } from "../Button/DeleteIconButton";
import { Panel } from "../Containers";
import { InputFoodEntry } from "../Forms";
import { SHOW_REPS, WORK_LABELS } from "./NewActivityLogForm";

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
              reps: "0",
            },
          ],
        },
      },
    });
  }, [log.id]);

  if (deleted) {
    return null;
  }

  const loading = or(deleteLoading, saveLoading);

  return (
    <Panel loading={loading}>
      <form
        className="w-full flex gap-4 items-center"
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
    </Panel>
  );
}
