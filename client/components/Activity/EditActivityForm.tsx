import React from "react";

import { PrimaryLoader } from "../Loading/Primary";
import { ActivityForm } from "./ActivityForm";

import {
  useGetActivityDetailsQuery,
  useSaveActivityMutation,
} from "../../generated";
import { ActivityType } from "../../../api/graphql-types";

export function EditActivityForm({ id = "id" }: { id?: string }) {
  const { loading, data } = useGetActivityDetailsQuery({
    variables: {
      id,
    },
  });
  const [saveActivity, { loading: saving }] = useSaveActivityMutation();
  const loadedData = data?.currentUser?.activities.edges[0]?.node;
  const onSave = React.useCallback(
    async (
      {
        name,
        description,
        type,
        intensity,
      }: {
        name?: Maybe<string>;
        description?: Maybe<string>;
        type?: Maybe<ActivityType>;
        intensity?: Maybe<number>;
      },
      onComplete?: Function
    ) => {
      await saveActivity({
        variables: {
          input: {
            id,
            name,
            description,
            type,
            intensity,
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
    <ActivityForm
      loading={saving}
      initialValues={{
        description: loadedData.description,
        name: loadedData.name,
        exrx: loadedData.exrx,
        intensity: loadedData.intensity,
        type: loadedData.type,
      }}
      onSave={onSave}
    />
  );
}
