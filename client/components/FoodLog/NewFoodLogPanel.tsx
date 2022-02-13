import React from "react";
import { number, object, string } from "yup";

import {
  GetCurrentUserFoodLogDocument,
  useCreateOrUpdateFoodLogMutation,
} from "../../generated";
import { foodLogLocalStorage, useEvents, useToast } from "../../helpers";
import { FormStateObject, useForm } from "../../helpers/useForm";
import { BarcodeScannerButton } from "../BarcodeScanner";
import { PrimaryLightSaveButton } from "../Button/PrimaryLightSave";
import { PanelInverted } from "../Containers/PanelInverted";
import { Form, InputInverted } from "../Forms";

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
  descriptionInputRef: parentDescriptionInputRef,
}: {
  day: string;
  onSearch?: React.Dispatch<React.SetStateAction<string>>;
  formStateRef?: React.MutableRefObject<NewFoodLogFormObject | undefined>;
  descriptionInputRef?: React.MutableRefObject<HTMLInputElement | null>;
}) {
  const newFoodLogForm = useForm<NewFoodLogFormState>({ schema });
  const descriptionInputRef = React.useRef<HTMLInputElement | null>(null);
  const { success, error } = useToast();
  const { subscribe, unsubscribe, fire } = useEvents();

  React.useEffect(() => {
    subscribe("foodLogAdded", "focusFoodLogDescription", () => {
      descriptionInputRef.current?.focus();
      newFoodLogForm.clear();
    });
    return () => unsubscribe("foodLogAdded", "focusFoodLogDescription");
  }, []);

  if (parentDescriptionInputRef) {
    parentDescriptionInputRef.current = descriptionInputRef.current;
  }

  if (formStateRef && !formStateRef.current) {
    formStateRef.current = newFoodLogForm;
  }

  const [createFood, { loading }] = useCreateOrUpdateFoodLogMutation({
    refetchQueries: [GetCurrentUserFoodLogDocument],
    onCompleted: () => {
      newFoodLogForm.clear();
      fire("foodLogAdded");
      success("Food log created");
    },
    onError: error,
  });
  const create = () => {
    createFood({
      awaitRefetchQueries: true,
      refetchQueries: [GetCurrentUserFoodLogDocument],
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
    <PanelInverted className="p-2">
      <Form loading={loading} onSubmit={create} className="flex flex-col gap-4">
        <InputInverted
          placeholder=""
          label="Description"
          type="text"
          onChange={newFoodLogForm.getHandler("description")}
          value={newFoodLogForm.getValue("description", "")}
          inputElementRef={descriptionInputRef}
          focusOnFirstRender
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
        <div className="flex text-md gap-2 justify-end">
          <BarcodeScannerButton day={day} />
          <PrimaryLightSaveButton loading={loading} type="submit" />
        </div>
      </Form>
    </PanelInverted>
  );
}
