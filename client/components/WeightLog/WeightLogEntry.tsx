import cx from "classnames";
import React from "react";

import { or } from "../../../shared";
import {
  GetCurrentUserWeightLogDocument,
  useCreateOrUpdateWeightLogMutation,
  useDeleteWeightLogMutation,
} from "../../generated";
import { useForm } from "../../helpers/useForm";
import { useToast } from "../../helpers/useToast";
import { DeleteIconButton } from "../Button/DeleteIconButton";
import { Panel } from "../Containers";
import { Form, InputFoodEntry } from "../Forms";

export function WeightLogEntry({
  entry,
  day,
}: {
  day: string;
  entry: {
    id: string;
    ago: string;
    weightString: string;
  };
}) {
  const { error, success } = useToast();
  const [deleted, setDeleted] = React.useState(false);
  const [createOrUpdateWeightLogMutation, { loading: saving }] =
    useCreateOrUpdateWeightLogMutation({
      onCompleted: () => {
        success("Weight log entry saved!");
      },
      onError: error,
    });
  const formData = useForm<{
    weightString: string;
  }>({
    initialValues: {
      weightString: entry.weightString,
    },
  });
  const [deleteWeightLogMutation, { loading: deleting }] =
    useDeleteWeightLogMutation({
      refetchQueries: [GetCurrentUserWeightLogDocument],
      awaitRefetchQueries: true,
      onCompleted: () => success("Weight log entry deleted!"),
      onError: (err) => {
        error(err);
        setDeleted(false);
      },
    });

  const save = React.useCallback(() => {
    createOrUpdateWeightLogMutation({
      variables: {
        input: {
          day,
          weightLogs: [
            {
              id: entry.id,
              weight: formData.getValue("weightString"),
            },
          ],
        },
      },
    });
  }, []);

  const handleDelete = React.useCallback(() => {
    setDeleted(true);
    deleteWeightLogMutation({
      variables: {
        id: entry.id,
      },
    });
  }, []);

  if (deleted) {
    return null;
  }

  const loading = or(saving, deleting);

  return (
    <Panel
      className={cx({
        "opacity-50 pointer-events-none": loading,
      })}
      loading={loading}
    >
      <Form
        onSubmit={save}
        className="flex items-end gap-2 opacity-75 hover:opacity-100 justify-between"
      >
        <InputFoodEntry
          onChange={formData.getHandler("weightString")}
          value={formData.getValue("weightString")}
          type="text"
          label="Enter your weight, e.g., 215 lbs, 5 stone"
          className="w-8/12"
          showLabel={false}
        />
        <div className="w-3/12 text-xs opacity-50">{entry.ago}</div>
        <DeleteIconButton onClick={handleDelete} title="Delete weight log" />
        <button type="submit" className="screen-reader-text">
          Save
        </button>
      </Form>
    </Panel>
  );
}
