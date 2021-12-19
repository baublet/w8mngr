import React from "react";
import cx from "classnames";

import { Input, MultilineInput, SingleSelect, Slider } from "../Forms";
import { Spacer } from "../Spacer";
import { SecondaryButton } from "../Button/Secondary";
import { ContentContainer } from "../Containers/ContentContainer";
import { ContentLayout } from "../Containers/ContentLayout";

import { activityTypeToHumanReadable, useForm } from "../../helpers";
import { ActivityType, Muscle } from "../../generated";
import { MuscleMap } from "../MuscleMap";
import { IntensityScale } from "./IntensityScale";

type FormData = {
  name: string;
  description: string;
  exrx: string;
  type: ActivityType;
  intensity: number;
  muscleGroups: Muscle[];
};
export type PartialFormData = { [K in keyof FormData]?: FormData[K] | null };

const types: ActivityType[] = ["DISTANCE", "REPETITIVE", "TIMED", "WEIGHT"];

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
        sideContent={
          <MuscleMap
            active={true}
            showSummary={true}
            onChange={formData.getHandler("muscleGroups")}
            selected={formData.getValue("muscleGroups")}
          />
        }
        mainContent={
          <form onSubmit={handleSave}>
            <div className="flex w-full flex-col">
              <Input
                placeholder="Activity name"
                type="text"
                label="Name"
                labelPlacement="bottom"
                onChange={formData.getHandler("name")}
                value={formData.getValue("name")}
              />
              <Spacer size="s" />
              <div className="flex gap-4">
                <div>
                  <SingleSelect
                    id="activity-type"
                    label="Type"
                    defaultSelectedKey={formData.getValue("type")}
                    labelPlacement="bottom"
                    options={types.map((type) => ({
                      key: type,
                      text: activityTypeToHumanReadable(type),
                    }))}
                    onChange={formData.getHandler("type")}
                  />
                </div>
                <div className="w-full">
                  <Slider
                    min={0}
                    max={10}
                    label="intensity"
                    id="intensity-slider"
                    lowerLabel="Less intense"
                    higherLabel="More intense"
                    defaultValue={formData.getValue("intensity")}
                    onChange={formData.getHandler("intensity")}
                    labelPlacement="bottom"
                    scaleEndAdornment={
                      <IntensityScale
                        intensity={formData.getValue("intensity")}
                        size="small"
                      />
                    }
                  />
                </div>
              </div>
              <Spacer size="s" />
              <MultilineInput
                labelPlacement="bottom"
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
