import React from "react";
import { object, string, number } from "yup";

import { PanelInverted } from "../Containers/PanelInverted";
import { useForm } from "../../helpers/useForm";
import { InputInverted, Form } from "../Forms";
import { SecondaryButton } from "../Button/Secondary";
import { Spacer } from "../Spacer";

import {
  useCreateOrUpdateFoodLogMutation,
  GetCurrentUserFoodLogDocument,
} from "../../generated";

const schema = object().shape({
  description: string().required(),
  calories: number().optional().default(undefined),
  fat: number().optional().default(undefined),
  carbs: number().optional().default(undefined),
  protein: number().optional().default(undefined),
});

export function NewFoodLogPanel({ day }: { day: string }) {
  const newFoodLogForm = useForm<{
    description: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  }>({ schema });
  const [createFood, { loading }] = useCreateOrUpdateFoodLogMutation({
    onCompleted: newFoodLogForm.clear,
    refetchQueries: [GetCurrentUserFoodLogDocument],
  });
  const create = () => {
    createFood({
      onCompleted: newFoodLogForm.clear,
      variables: {
        input: { day, foodLogs: [newFoodLogForm.getCastValues()] },
      },
    });
  };

  console.log({ loading });

  return (
    <PanelInverted className="p-2 max-w-sm">
      <Form loading={loading} onSubmit={create}>
        <InputInverted
          placeholder=""
          label="Description"
          type="text"
          onChange={newFoodLogForm.getHandler("description")}
          value={newFoodLogForm.getValue("description")}
        />
        <div className="flex gap-1 mt-2">
          <InputInverted
            placeholder=""
            label="Calories"
            type="text"
            onChange={newFoodLogForm.getHandler("calories")}
            value={newFoodLogForm.getValue("calories")}
          />
          <InputInverted
            placeholder=""
            label="Fat"
            type="text"
            onChange={newFoodLogForm.getHandler("fat")}
            value={newFoodLogForm.getValue("fat")}
          />
          <InputInverted
            placeholder=""
            label="Carbs"
            type="text"
            onChange={newFoodLogForm.getHandler("carbs")}
            value={newFoodLogForm.getValue("carbs")}
          />
          <InputInverted
            placeholder=""
            label="Protein"
            type="text"
            onChange={newFoodLogForm.getHandler("protein")}
            value={newFoodLogForm.getValue("protein")}
          />
        </div>
        <div className="flex">
          <div className="flex-grow" />
          <div className="flex flex-col">
            <Spacer size="s" />
            <SecondaryButton
              leftIcon={loading ? <b>loading</b> : undefined}
              type="submit"
            >
              New Entry
            </SecondaryButton>
          </div>
        </div>
      </Form>
    </PanelInverted>
  );
}
