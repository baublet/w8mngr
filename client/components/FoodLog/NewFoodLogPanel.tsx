import React from "react";

import { PanelInverted } from "../Containers/PanelInverted";
import { useForm } from "../../helpers/useForm";
import { InputPrimaryInverted } from "../Forms";
import { PrimaryLightButton } from "../Button/PrimaryLight";
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
      <InputPrimaryInverted
        placeholder=""
        label="Description"
        type="text"
        onChange={newFoodLogForm.getHandler("name")}
      />
      <div className="flex gap-1">
        <InputPrimaryInverted
          placeholder=""
          label="Calories"
          type="text"
          onChange={newFoodLogForm.getHandler("calories")}
        />
        <InputPrimaryInverted
          placeholder=""
          label="Fat"
          type="text"
          onChange={newFoodLogForm.getHandler("fat")}
        />
        <InputPrimaryInverted
          placeholder=""
          label="Carbs"
          type="text"
          onChange={newFoodLogForm.getHandler("carbs")}
        />
        <InputPrimaryInverted
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
          <PrimaryLightButton>New Entry</PrimaryLightButton>
        </div>
      </div>
    </PanelInverted>
  );
}
