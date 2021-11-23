import React from "react";
import cx from "classnames";
import { object, string, number } from "yup";

import { DeleteIconButton } from "../Button/DeleteIconButton";
import { Form, InputFoodEntry } from "../Forms";
import { LogEntryLoadingBullet } from "../Loading/LogEntryLoadingBullet";

import { useForm } from "../../helpers";

import {
  useCreateOrUpdateFoodLogMutation,
  useDeleteFoodLogMutation,
  GetCurrentUserFoodLogDocument,
} from "../../generated";

const schema = object().shape({
  id: string().required(),
  description: string().required(),
  calories: number().optional(),
  fat: number().optional(),
  carbs: number().optional(),
  protein: number().optional(),
});

export function LogEntry({
  id,
  day,
  description,
  calories,
  fat,
  carbs,
  protein,
}: {
  id: string;
  day: string;
  description: string;
  calories?: number | null;
  fat?: number | null;
  carbs?: number | null;
  protein?: number | null;
}) {
  const logEntryForm = useForm<{
    id: string;
    description: string;
    calories?: number;
    fat?: number;
    carbs?: number;
    protein?: number;
  }>({
    schema,
    initialValues: {
      id,
      description,
      calories,
      carbs,
      fat,
      protein,
    },
  });
  const [createOrUpdateFoodLog, { loading: createOrUpdateLoading }] =
    useCreateOrUpdateFoodLogMutation({});
  const [deleteFoodLog, { loading: deleteLoading }] = useDeleteFoodLogMutation({
    refetchQueries: [GetCurrentUserFoodLogDocument],
  });

  const loading = createOrUpdateLoading || deleteLoading;

  const save = React.useCallback(() => {
    createOrUpdateFoodLog({
      refetchQueries: [GetCurrentUserFoodLogDocument],
      variables: {
        input: {
          day,
          foodLogs: [logEntryForm.getCastValues()],
        },
      },
    });
  }, []);

  return (
    <div className="relax flex w-full items-center hover:bg-gray-50  hover:bg-opacity-50 border border-gray-100 border-opacity-0 hover:border-opacity-75">
      <div
        className="absolute inset point-events-none flex items-center"
        style={{
          transform: "translateX(-1em)",
        }}
      >
        <LogEntryLoadingBullet visible={loading} />
      </div>

      <div
        className={cx("rounded bg-purple-50 bg-opacity-5 p-4 flex w-full", {
          "pointer-events-none": loading,
        })}
      >
        <Form loading={loading} onSubmit={save}>
          <div className="w-full flex gap-1">
            <div className="w-2/3">
              <InputFoodEntry
                type="text"
                onChange={logEntryForm.getHandler("description")}
                value={logEntryForm.getValue("description")}
                label="Description"
                id={`description-${id}`}
                showLabel
              />
            </div>
            <InputFoodEntry
              type="text"
              onChange={logEntryForm.getHandler("calories")}
              value={logEntryForm.getValue("calories")}
              label="Calories"
              id={`calories-${id}`}
              showLabel
            />
            <InputFoodEntry
              type="text"
              onChange={logEntryForm.getHandler("fat")}
              value={logEntryForm.getValue("fat")}
              label="Carbs"
              id={`carbs-${id}`}
              showLabel
            />
            <InputFoodEntry
              type="text"
              onChange={logEntryForm.getHandler("carbs")}
              value={logEntryForm.getValue("carbs")}
              label="Fat"
              id={`fat-${id}`}
              showLabel
            />
            <InputFoodEntry
              type="text"
              onChange={logEntryForm.getHandler("protein")}
              value={logEntryForm.getValue("protein")}
              label="Protein"
              id={`protein-${id}`}
              showLabel
            />
          </div>
        </Form>
      </div>
      <div className="px-4">
        <DeleteIconButton
          onClick={() => deleteFoodLog({ variables: { id } })}
        />
      </div>
    </div>
  );
}
