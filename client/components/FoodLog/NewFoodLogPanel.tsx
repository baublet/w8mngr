import React from "react";
import { number, object, string } from "yup";

import { findOrFail } from "../../../shared";
import {
  GetCurrentUserFoodLogDocument,
  useCreateOrUpdateFoodLogMutation,
  useGetCurrentUserQuery,
} from "../../generated";
import { foodLogLocalStorage } from "../../helpers/foodLogLocalStorage";
import { useEvents } from "../../helpers/useEvents";
import { useToast } from "../../helpers/useToast";
import { FormStateObject, useForm } from "../../helpers/useForm";
import { BarcodeScannerButton } from "../BarcodeScanner";
import { PrimaryLightSaveButton } from "../Button/PrimaryLightSave";
import { SecondaryIconButton } from "../Button/SecondaryIcon";
import { PanelInverted } from "../Containers/PanelInverted";
import { Form, InputInverted } from "../Forms";
import { BirthdayIcon } from "../Icons/Birthday";

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

  const { loading: currentUserLoading, data: currentUserData } =
    useGetCurrentUserQuery();

  const addFaturday = React.useCallback(() => {
    const currentUser = currentUserData?.currentUser;
    if (!currentUser) {
      return;
    }

    const enabled = findOrFail(
      currentUser.preferences,
      (pref) => pref.key === "FATURDAYS"
    );

    if (!enabled.value) {
      return;
    }

    const calories =
      findOrFail(
        currentUser.preferences,
        (pref) => pref.key === "FATURDAY_CALORIES"
      ).value || 0;
    const fat =
      findOrFail(currentUser.preferences, (pref) => pref.key === "FATURDAY_FAT")
        .value || 0;
    const carbs =
      findOrFail(
        currentUser.preferences,
        (pref) => pref.key === "FATURDAY_CARBS"
      ).value || 0;
    const protein =
      findOrFail(
        currentUser.preferences,
        (pref) => pref.key === "FATURDAY_PROTEIN"
      ).value || 0;

    createFood({
      awaitRefetchQueries: true,
      refetchQueries: [GetCurrentUserFoodLogDocument],
      onCompleted: newFoodLogForm.clear,
      variables: {
        input: {
          day,
          foodLogs: [
            {
              description:
                newFoodLogForm.getValue("description") || "Faturday!",
              calories,
              fat,
              carbs,
              protein,
            },
          ],
        },
      },
    });
  }, [currentUserData, day]);

  const showFaturdays = React.useMemo(() => {
    const currentUser = currentUserData?.currentUser;
    if (!currentUser) {
      return false;
    }

    const enabled = findOrFail(
      currentUser.preferences,
      (pref) => pref.key === "FATURDAYS"
    );

    return Boolean(enabled.value);
  }, [currentUserData]);

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
          <div>
            {showFaturdays && (
              <SecondaryIconButton
                loading={currentUserLoading}
                disabled={currentUserLoading}
                onClick={addFaturday}
              >
                <BirthdayIcon />
              </SecondaryIconButton>
            )}
          </div>
          <BarcodeScannerButton day={day} />
          <PrimaryLightSaveButton loading={loading} type="submit" />
        </div>
      </Form>
    </PanelInverted>
  );
}
