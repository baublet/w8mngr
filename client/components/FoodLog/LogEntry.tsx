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
  const [deleted, setDeleted] = React.useState(false);
  const [deleteFoodLog, { loading: deleteLoading }] = useDeleteFoodLogMutation({
    onError: () => setDeleted(false),
  });

  const loading = createOrUpdateLoading || deleteLoading;

  const save = React.useCallback(() => {
    createOrUpdateFoodLog({
      variables: {
        input: {
          day,
          foodLogs: [logEntryForm.getCastValues()],
        },
      },
    });
  }, []);

  if (deleted) {
    return <div className="opacity-0 pointer-events-none absolute" />;
  }

  return (
    <div
      className={cx(
        "relax flex w-full items-center hover:bg-slate-50 rounded hover:bg-opacity-50 border border-slate-100 border-opacity-0 hover:border-opacity-75",
        { "opacity-50": deleteLoading }
      )}
    >
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
          <div className="w-full flex gap-2">
            <div style={{ minWidth: "50%" }}>
              <InputFoodEntry
                type="text"
                onChange={logEntryForm.getHandler("description")}
                value={logEntryForm.getValue("description")}
                label="Description"
                id={`description-${id}`}
                showLabel
              />
            </div>
            <div className="flex gap-2">
              <div>
                <InputFoodEntry
                  type="text"
                  onChange={logEntryForm.getHandler("calories")}
                  value={logEntryForm.getValue("calories")}
                  label="Calories"
                  id={`calories-${id}`}
                  showLabel
                />
              </div>
              <div>
                <InputFoodEntry
                  type="text"
                  onChange={logEntryForm.getHandler("fat")}
                  value={logEntryForm.getValue("fat")}
                  label="Carbs"
                  id={`carbs-${id}`}
                  showLabel
                />
              </div>
              <div>
                <InputFoodEntry
                  type="text"
                  onChange={logEntryForm.getHandler("carbs")}
                  value={logEntryForm.getValue("carbs")}
                  label="Fat"
                  id={`fat-${id}`}
                  showLabel
                />
              </div>
              <div>
                <InputFoodEntry
                  type="text"
                  onChange={logEntryForm.getHandler("protein")}
                  value={logEntryForm.getValue("protein")}
                  label="Protein"
                  id={`protein-${id}`}
                  showLabel
                />
              </div>
            </div>
          </div>
        </Form>
      </div>
      <div className="px-4">
        <DeleteIconButton
          onClick={() => {
            setDeleted(true);
            deleteFoodLog({ variables: { id } });
          }}
        />
      </div>
    </div>
  );
}
