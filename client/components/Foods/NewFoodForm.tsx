import omit from "lodash.omit";
import React from "react";
import { useHistory } from "react-router-dom";

import { withNumericKeys } from "../../../shared";
import { Maybe } from "../../../shared/types";
import { MeasurementInput, useSaveFoodMutation } from "../../generated";
import { useToast } from "../../helpers";
import { FoodForm } from "./FoodForm";

export function NewFoodForm() {
  const { error, success } = useToast();
  const { replace } = useHistory();
  const [saveFood, { loading }] = useSaveFoodMutation({
    onCompleted: (data) => {
      success("New Food created");
      replace(`/foods/edit/${data.saveFood.food?.id}`);
    },
    onError: error,
  });
  const handleSave = React.useCallback(
    ({
      description,
      imageUploadId,
      name,
      measurements,
    }: {
      name?: Maybe<string>;
      description?: Maybe<string>;
      imageUploadId?: Maybe<string>;
      measurements?: Maybe<MeasurementInput[]>;
    }) => {
      const measurementsToSave = measurements?.map((measurement) =>
        omit(
          withNumericKeys(
            measurement,
            ["amount", "calories", "carbs", "fat", "protein"],
            0
          ),
          "internalId"
        )
      );
      saveFood({
        variables: {
          input: {
            description,
            name,
            imageUploadId,
            measurements: measurementsToSave,
          },
        },
      });
    },
    []
  );
  return <FoodForm loading={loading} onSave={handleSave} />;
}
