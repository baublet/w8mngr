import React from "react";

import { PanelInverted } from "../Containers/PanelInverted";
import { useForm } from "../../helpers/useForm";
import { InputInverted } from "../Forms";
import { SecondaryButton } from "../Button/Secondary";
import { Spacer } from "../Spacer";

export function NewFoodLogPanel({ day }: { day: string }) {
  const newFoodLogForm = useForm<{
    name: string;
    calories: string;
    fat: string;
    carbs: string;
    protein: string;
  }>();

  return (
    <PanelInverted className="p-2 max-w-sm">
      <InputInverted
        placeholder=""
        label="Description"
        type="text"
        onChange={newFoodLogForm.getHandler("name")}
      />
      <div className="flex gap-1 mt-2">
        <InputInverted
          placeholder=""
          label="Calories"
          type="text"
          onChange={newFoodLogForm.getHandler("calories")}
        />
        <InputInverted
          placeholder=""
          label="Fat"
          type="text"
          onChange={newFoodLogForm.getHandler("fat")}
        />
        <InputInverted
          placeholder=""
          label="Carbs"
          type="text"
          onChange={newFoodLogForm.getHandler("carbs")}
        />
        <InputInverted
          placeholder=""
          label="Protein"
          type="text"
          onChange={newFoodLogForm.getHandler("protein")}
        />
      </div>
      <div className="flex">
        <div className="flex-grow" />
        <div className="flex flex-col">
          <Spacer size="s" />
          <SecondaryButton>New Entry</SecondaryButton>
        </div>
      </div>
    </PanelInverted>
  );
}
