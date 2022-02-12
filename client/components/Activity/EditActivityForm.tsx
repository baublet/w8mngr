import React from "react";

import { ActivityType } from "../../../api/generated";
import { Maybe } from "../../../shared/types";
import {
  Muscle,
  useGetActivityDetailsQuery,
  useSaveActivityMutation,
} from "../../generated";
import { useToast } from "../../helpers";
import { PrimaryLoader } from "../Loading/Primary";
import { ActivityForm } from "./ActivityForm";

export function EditActivityForm({ id = "id" }: { id?: string }) {
  const { error, success } = useToast();
  const { loading, data } = useGetActivityDetailsQuery({
    variables: {
      id,
    },
  });
  const [saveActivity, { loading: saving }] = useSaveActivityMutation({
    onCompleted: () => success("Activity saved!"),
    onError: error,
  });
  const loadedData = data?.currentUser?.activities.edges[0]?.node;
  const onSave = React.useCallback(
    async (
      {
        name,
        description,
        type,
        intensity,
        muscleGroups,
      }: {
        name?: Maybe<string>;
        description?: Maybe<string>;
        type?: Maybe<ActivityType>;
        intensity?: Maybe<number>;
        muscleGroups?: Maybe<Muscle[]>;
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
            muscleGroups,
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
        muscleGroups: loadedData.muscleGroups,
      }}
      onSave={onSave}
    />
  );
}
