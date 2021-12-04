import React from "react";
import { object, string, number } from "yup";

import { PanelInverted } from "../Containers/PanelInverted";
import { useForm, FormStateObject } from "../../helpers/useForm";
import { InputInverted, Form } from "../Forms";
import { SecondaryButton } from "../Button/Secondary";
import { Spacer } from "../Spacer";
import { ButtonSpinner } from "../Loading/ButtonSpinner";

import { foodLogLocalStorage } from "../../helpers";
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

export type NewFoodLogFormState = {
  description: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
};

export type NewFoodLogFormObject = FormStateObject<NewFoodLogFormState>;

export function NewFoodLogPanel({
  day,
  onSearch,
  formStateRef,
}: {
  day: string;
  onSearch?: React.Dispatch<React.SetStateAction<string>>;
  formStateRef?: React.MutableRefObject<NewFoodLogFormObject | undefined>;
}) {
  const newFoodLogForm = useForm<NewFoodLogFormState>({ schema });

  if (formStateRef && !formStateRef.current) {
    formStateRef.current = newFoodLogForm;
  }

  const [createFood, { loading }] = useCreateOrUpdateFoodLogMutation({
    onCompleted: newFoodLogForm.clear,
    refetchQueries: [
      {
        query: GetCurrentUserFoodLogDocument,
        variables: {
          day,
        },
      },
    ],
  });
  const create = () => {
    createFood({
      onCompleted: newFoodLogForm.clear,
      variables: {
        input: { day, foodLogs: [newFoodLogForm.getCastValues()] },
      },
    });
  };

  React.useEffect(() => {
    onSearch?.(newFoodLogForm.getValue("description", ""));
  }, [newFoodLogForm.getValue("description")]);

  // On the first render, see if there's a food log in local storage so we can add it
  React.useEffect(() => {
    const foodLogStorage = foodLogLocalStorage();
    const items = foodLogStorage.getItems();
    if (items.length) {
      foodLogStorage.clear();
      createFood({
        variables: {
          input: { day, foodLogs: items },
        },
      });
    }
  }, []);

  return (
    <PanelInverted className="p-2 max-w-sm">
      <Form loading={loading} onSubmit={create}>
        <InputInverted
          placeholder=""
          label="Description"
          type="text"
          onChange={newFoodLogForm.getHandler("description")}
          value={newFoodLogForm.getValue("description", "")}
        />
        <div className="flex gap-1 mt-2">
          <InputInverted
            placeholder=""
            label="Calories"
            type="text"
            onChange={newFoodLogForm.getHandler("calories")}
            value={newFoodLogForm.getValue("calories", "")}
          />
          <InputInverted
            placeholder=""
            label="Fat"
            type="text"
            onChange={newFoodLogForm.getHandler("fat")}
            value={newFoodLogForm.getValue("fat", "")}
          />
          <InputInverted
            placeholder=""
            label="Carbs"
            type="text"
            onChange={newFoodLogForm.getHandler("carbs")}
            value={newFoodLogForm.getValue("carbs", "")}
          />
          <InputInverted
            placeholder=""
            label="Protein"
            type="text"
            onChange={newFoodLogForm.getHandler("protein")}
            value={newFoodLogForm.getValue("protein", "")}
          />
        </div>
        <div className="flex">
          <div className="flex-grow" />
          <div className="flex flex-col text-md">
            <Spacer size="s" />
            <SecondaryButton
              leftIcon={loading ? <ButtonSpinner /> : undefined}
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
