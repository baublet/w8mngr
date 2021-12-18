import React from "react";
import cx from "classnames";

import { Input, MultilineInput } from "../Forms";
import { Spacer } from "../Spacer";
import { SecondaryButton } from "../Button/Secondary";
import { ContentContainer } from "../Containers/ContentContainer";
import { ContentLayout } from "../Containers/ContentLayout";

import { useForm } from "../../helpers";
import { ActivityType, Muscle } from "../../generated";

type FormData = {
  name: string;
  description: string;
  exrx: string;
  type: ActivityType;
  intensity: number;
  muscleGroups: Muscle[];
};
export type PartialFormData = { [K in keyof FormData]?: FormData[K] | null };

export function ActivityForm({
  initialValues,
  onSave,
  loading,
}: {
  initialValues?: PartialFormData;
  onSave: (formState: PartialFormData) => void;
  loading: boolean;
}) {
  const formData = useForm<FormData>({
    initialValues,
  });

  React.useEffect(() => {
    if (initialValues) {
      formData.setValues(initialValues);
    }
  }, [initialValues]);

  const handleSave = React.useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      if (event) {
        event.preventDefault();
      }
      onSave(formData.getValues());
    },
    []
  );

  return (
    <ContentContainer
      className={cx({ "opacity-50 pointer-events-none blur": loading })}
    >
      <ContentLayout
        mainContent={
          <form onSubmit={handleSave}>
            <div className="flex w-full flex-col">
              <Input
                placeholder="Activity name"
                type="text"
                label="Name"
                showLabel={false}
                onChange={formData.getHandler("name")}
                value={formData.getValue("name")}
              />
              <Spacer size="s" />
              <MultilineInput
                placeholder="Description"
                type="text"
                label="Description"
                onChange={formData.getHandler("description")}
                value={formData.getValue("description")}
              />
              <Spacer />
              <Spacer />
              <div className="flex w-full gap-4 justify-end">
                <SecondaryButton
                  onClick={handleSave}
                  type="submit"
                  disabled={loading}
                >
                  Save Activity
                </SecondaryButton>
              </div>
            </div>
          </form>
        }
      />
    </ContentContainer>
  );
}
