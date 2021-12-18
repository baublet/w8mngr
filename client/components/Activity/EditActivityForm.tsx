import React from "react";

import { PrimaryLoader } from "../Loading/Primary";
import { ActivityForm } from "./ActivityForm";

import {
  useGetActivitiesQuery,
  useSaveActivityMutation,
} from "../../generated";

export function EditActivityForm({ id }: { id: string }) {
  const { loading, data } = useGetActivitiesQuery({
    variables: {
      input: {
        filter: {
          id,
        },
      },
    },
  });
  const [saveActivity, { loading: saving }] = useSaveActivityMutation();
  const loadedData = data?.currentUser?.activities.edges[0]?.node;
  const onSave = React.useCallback(
    async (
      {
        name,
        description,
      }: {
        name?: Maybe<string>;
        description?: Maybe<string>;
      },
      onComplete?: Function
    ) => {
      await saveActivity({
        variables: {
          input: {
            id,
            name,
            description,
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
      }}
      onSave={onSave}
    />
  );
}
