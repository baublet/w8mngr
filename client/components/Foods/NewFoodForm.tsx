import React from "react";
import { useHistory } from "react-router-dom"

import { FoodForm } from "./FoodForm";
import { useSaveFoodMutation } from "../../generated";

export function NewFoodForm() {
  const { replace } = useHistory();
  const [saveFood, { loading }] = useSaveFoodMutation({
    onCompleted: (data) => {
      replace(`/foods/edit/${data.saveFood.food?.id}`)
    }
  });
  const handleSave = React.useCallback(
    ({
      description,
      imageUploadId,
      name,
    }: {
      name?: Maybe<string>;
      description?: Maybe<string>;
      imageUploadId?: Maybe<string>;
    }) => {
      saveFood({
        variables: {
          input: {
            description,
            name,
            imageUploadId,
          },
        },
      });
    },
    []
  );
  return <FoodForm loading={loading} onSave={handleSave} />;
}
