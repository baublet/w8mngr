import cx from "classnames";
import React from "react";

import { or } from "../../../shared/coalesce";
import { useForm } from "../../helpers/useForm";
import { SecondaryButton } from "../Button/Secondary";
import { ContentContainer } from "../Containers/ContentContainer";
import { ContentLayout } from "../Containers/ContentLayout";
import { Input } from "../Forms/Input";
import { MultilineInput } from "../Forms/MultilineInput";
import { Upload } from "../Forms/Upload";
import { Spacer } from "../Spacer";
import {
  FoodMeasurementsForm,
  FormMeasurementInput,
} from "./FoodMeasurementsForm";

type MeasurementInput = Omit<FormMeasurementInput, "internalId">;

type FormData = {
  name: string;
  description: string;
  imageUploadId: string;
  selectedUploadIds: string[];
  measurements: MeasurementInput[];
};
type PartialFormData = { [K in keyof FormData]?: FormData[K] | null };

export function FoodForm({
  initialValues,
  onSave,
  loading,
}: {
  initialValues?: PartialFormData;
  onSave: (formState: PartialFormData) => void;
  loading: boolean;
}) {
  const foodFormData = useForm<FormData>({
    initialValues,
  });

  React.useEffect(() => {
    if (initialValues) {
      foodFormData.setValues(initialValues);
    }
  }, [initialValues]);

  const handleSave = React.useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      if (event) {
        event.preventDefault();
      }
      onSave(foodFormData.getValues());
    },
    [],
  );

  React.useEffect(() => {
    const ids = foodFormData.getValue("selectedUploadIds");
    foodFormData.setValue(
      "imageUploadId",
      Array.isArray(ids) ? ids[0] : undefined,
    );
  }, [foodFormData.getValue("selectedUploadIds")]);

  const defaultSelectedUploadId = initialValues?.imageUploadId;
  const defaultSelectedUploadIds = defaultSelectedUploadId
    ? [defaultSelectedUploadId]
    : [];

  const initialMeasurements = React.useMemo(() => {
    const measurements = initialValues?.measurements;
    if (measurements) {
      return measurements.map((measurement) => ({
        ...measurement,
        internalId: or(measurement.id, ""),
      }));
    }
    return [];
  }, [initialValues]);

  return (
    <ContentContainer
      className={cx({ "opacity-50 pointer-events-none blur": loading })}
    >
      <ContentLayout
        mainContent={
          <form onSubmit={handleSave}>
            <div className="flex w-full flex-col">
              <Input
                placeholder="Food name"
                type="text"
                label="Name"
                showLabel={false}
                onChange={foodFormData.getHandler("name")}
                value={foodFormData.getValue("name")}
              />
              <Spacer size="s" />
              <MultilineInput
                placeholder="Description"
                type="text"
                label="Description"
                onChange={foodFormData.getHandler("description")}
                value={foodFormData.getValue("description")}
              />
              <Spacer />
              <FoodMeasurementsForm
                initialData={initialMeasurements}
                onChange={foodFormData.getHandler("measurements")}
              />
              <Spacer />
              <div className="flex w-full gap-4 justify-end">
                <SecondaryButton
                  onClick={handleSave}
                  type="submit"
                  disabled={loading}
                >
                  Save Food
                </SecondaryButton>
              </div>
            </div>
          </form>
        }
        sideContent={
          <Upload
            onChange={foodFormData.getHandler("selectedUploadIds")}
            defaultSelectedUploadIds={defaultSelectedUploadIds}
            placeholder={
              <span>
                <b>Food image</b> (optional)
              </span>
            }
          />
        }
      />
    </ContentContainer>
  );
}
