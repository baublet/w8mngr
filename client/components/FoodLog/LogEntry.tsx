import cx from "classnames";
import React from "react";
import { number, object, string } from "yup";

import {
  GetCurrentUserFoodLogDocument,
  useCreateOrUpdateFoodLogMutation,
  useDeleteFoodLogMutation,
} from "../../generated";
import { useForm, useToast } from "../../helpers";
import { DeleteIconButton } from "../Button/DeleteIconButton";
import { Panel } from "../Containers";
import { Form, InputFoodEntry } from "../Forms";

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
  const { error, success } = useToast();
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
    useCreateOrUpdateFoodLogMutation({
      refetchQueries: [
        {
          query: GetCurrentUserFoodLogDocument,
          variables: { day },
        },
      ],
      awaitRefetchQueries: true,
      onError: error,
      onCompleted: () => success("Food log saved!"),
    });
  const [deleteFoodLog, { loading: deleteLoading }] = useDeleteFoodLogMutation({
    refetchQueries: [
      {
        query: GetCurrentUserFoodLogDocument,
        variables: { day },
      },
    ],
    awaitRefetchQueries: true,
    onError: error,
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

  return (
    <Panel
      loading={deleteLoading || createOrUpdateLoading}
      className="relax flex w-full items-center"
    >
      <div
        className={cx("rounded bg-purple-50 bg-opacity-5 flex w-full gap-4 items-center", {
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
      <div>
        <DeleteIconButton
          onClick={() => {
            deleteFoodLog({ variables: { id } });
          }}
        />
      </div>
      </div>
    </Panel>
  );
}
