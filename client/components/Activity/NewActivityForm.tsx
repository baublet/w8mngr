import React from "react";
import { useHistory } from "react-router-dom";

import { ActivityForm, PartialFormData } from "./ActivityForm";
import { useSaveActivityMutation } from "../../generated";
import { useToast } from "../../helpers";

export function NewActivityForm() {
  const { replace } = useHistory();
  const { error, success } = useToast();
  const [saveActivity, { loading }] = useSaveActivityMutation({
    onCompleted: (data) => {
      success("New activity created");
      replace(`/activities/edit/${data.saveActivity.activity?.id}`);
    },
    onError: error,
  });
  const handleSave = React.useCallback(
    async ({
      type = "REPETITIVE",
      description,
      exrx,
      intensity,
      muscleGroups,
      name,
    }: PartialFormData) => {
      await saveActivity({
        variables: {
          input: {
            name,
            description,
            exrx,
            intensity,
            muscleGroups,
            type,
          },
        },
      });
    },
    []
  );
  return <ActivityForm loading={loading} onSave={handleSave} />;
}
