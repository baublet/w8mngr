import cx from "classnames";
import React from "react";

import {
  GetCurrentUserWeightLogDocument,
  useCreateOrUpdateWeightLogMutation,
} from "../../generated";
import { useForm, useToast } from "../../helpers";
import { PrimaryLightSaveButton } from "../Button/PrimaryLightSave";
import { PanelInverted } from "../Containers/PanelInverted";
import { Form, InputInverted } from "../Forms";
import { NewWeightLogFormObject } from "./types";

export function NewWeightLog({ day }: { day: string }) {
  const formData = useForm<NewWeightLogFormObject>();
  const { error, success } = useToast();

  const [createOrUpdateWeightLogMutation, { loading: saving }] =
    useCreateOrUpdateWeightLogMutation({
      refetchQueries: [GetCurrentUserWeightLogDocument],
      awaitRefetchQueries: true,
      onError: error,
      onCompleted: () => {
        success("Weight log entry saved!");
        formData.clear();
      },
    });

  const save = React.useCallback(() => {
    createOrUpdateWeightLogMutation({
      variables: {
        input: {
          day,
          weightLogs: [
            {
              weight: formData.getValue("weight"),
            },
          ],
        },
      },
    });
  }, []);

  return (
    <PanelInverted
      className={cx({
        "opacity-50 pointer-events-none": saving,
      })}
    >
      <Form onSubmit={save} className="flex gap-2 items-start">
        <InputInverted
          value={formData.getValue("weight", "")}
          onChange={formData.getHandler("weight")}
          placeholder="e.g., 215 lbs"
          type="text"
          showLabel
          label="Weight"
        />
        <PrimaryLightSaveButton onClick={save} />
      </Form>
    </PanelInverted>
  );
}
