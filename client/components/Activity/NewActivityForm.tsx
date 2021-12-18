import React from "react";
import { useHistory } from "react-router-dom";
import omit from "lodash.omit";

import { ActivityForm, PartialFormData } from "./ActivityForm";
import { useSaveActivityMutation } from "../../generated";
import { withNumericKeys } from "../../../shared";

export function NewActivityForm() {
  const { replace } = useHistory();
  const [saveActivity, { loading }] = useSaveActivityMutation({
    onCompleted: (data) => {
      replace(`/activities/edit/${data.saveActivity.activity?.id}`);
    },
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
