import React from "react";
import omit from "lodash.omit";

import { PrimaryLoader } from "../Loading/Primary";
import { FoodForm } from "./FoodForm";

import { withNumericKeys } from "../../../shared";
import {
  useGetFoodDetailsQuery,
  useSaveFoodMutation,
  MeasurementInput,
} from "../../generated";

export function EditFoodForm({ id }: { id: string }) {
  const { loading, data } = useGetFoodDetailsQuery({
    variables: {
      id,
    },
  });
  const [saveFood, { loading: saving }] = useSaveFoodMutation();
  const loadedData = data?.currentUser?.foods.edges[0]?.node;
  const onSave = React.useCallback(
    async (
      {
        name,
        description,
        imageUploadId,
        measurements,
      }: {
        name?: Maybe<string>;
        description?: Maybe<string>;
        imageUploadId?: Maybe<string>;
        measurements?: Maybe<MeasurementInput[]>;
      },
      onComplete?: Function
    ) => {
      const measurementsToSave = measurements?.map((measurement) =>
        omit(
          withNumericKeys(
            measurement,
            ["amount", "calories", "carbs", "fat", "protein"],
            0
          ),
          "internalId",
          "__typename"
        )
      );

      await saveFood({
        variables: {
          input: {
            id,
            name,
            description,
            imageUploadId,
            measurements: measurementsToSave,
          },
        },
      });
    },
    []
  );

  if (loading || !loadedData) {
    return <PrimaryLoader />;
  }

  return (
    <FoodForm
      loading={saving}
      initialValues={{
        description: loadedData.description,
        imageUploadId: loadedData.image?.id,
        name: loadedData.name,
        selectedUploadIds: loadedData.image?.id ? [loadedData.image.id] : [],
        measurements: loadedData.measurements.edges.map((edge) => edge.node),
      }}
      onSave={onSave}
    />
  );
}
