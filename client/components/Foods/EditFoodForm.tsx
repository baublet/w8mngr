import React from "react";

import { PrimaryLoader } from "../Loading/Primary";
import { FoodForm } from "./FoodForm";

import { useGetFoodDetailsQuery, useSaveFoodMutation } from "../../generated";

export function EditFoodForm({ id }: { id: string }) {
  const { loading, data } = useGetFoodDetailsQuery({
    variables: {
      id,
    },
  });
  const [saveFood, { loading: saving }] = useSaveFoodMutation();
  const loadedData = data?.currentUser?.foods.edges[0]?.node;
  const onSave = React.useCallback(
    ({
      name,
      description,
      imageUploadId,
    }: {
      name?: Maybe<string>;
      description?: Maybe<string>;
      imageUploadId?: Maybe<string>;
    }) => {
      saveFood({
        variables: {
          input: {
            id,
            name,
            description,
            imageUploadId,
          },
        },
      });
    },
    []
  );

  if (loading || !loadedData) {
    return (
      <div className="text-purple-700">
        <PrimaryLoader />
      </div>
    );
  }

  return (
    <FoodForm
      loading={saving}
      initialValues={{
        description: loadedData.description,
        imageUploadId: loadedData.image?.id,
        name: loadedData.name,
        selectedUploadIds: loadedData.image?.id ? [loadedData.image.id] : [],
      }}
      onSave={onSave}
    />
  );
}
