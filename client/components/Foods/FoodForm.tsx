import React from "react";
import cx from "classnames";

import { Input, MultilineInput } from "../Forms";
import { Spacer } from "../Spacer";
import { SecondaryButton } from "../Button/Secondary";
import { ContentContainer } from "../Containers/ContentContainer";
import { ContentLayout } from "../Containers/ContentLayout";
import { Upload } from "../Forms/Upload";
import {FoodMeasurementsForm} from "./FoodMeasurementsForm"

import { useForm } from "../../helpers";

type FormData = {
  name: string;
  description: string;
  imageUploadId: string;
  selectedUploadIds: string[];
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

  const handleSave = React.useCallback(() => {
    onSave(foodFormData.getValues());
  }, []);

  React.useEffect(() => {
    const ids = foodFormData.getValue("selectedUploadIds");
    foodFormData.setValue(
      "imageUploadId",
      Array.isArray(ids) ? ids[0] || null : undefined || null
    );
  }, [foodFormData.getValue("selectedUploadIds")]);

  const defaultSelectedUploadId = initialValues?.imageUploadId;
  const defaultSelectedUploadIds = defaultSelectedUploadId
    ? [defaultSelectedUploadId]
    : [];

  return (
    <ContentContainer
      className={cx({ "opacity-50 pointer-events-none blur": loading })}
    >
      <ContentLayout
        mainContent={
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
            <FoodMeasurementsForm initialData={[]} />
            <Spacer />
            <div className="flex w-full gap-4 justify-end">
              <SecondaryButton onClick={handleSave}>Save Food</SecondaryButton>
            </div>
          </div>
        }
        sideContent={
          <>
            <Upload
              onChange={foodFormData.getHandler("selectedUploadIds")}
              defaultSelectedUploadIds={defaultSelectedUploadIds}
              placeholder={
                <span>
                  <b>Food image</b> (optional)
                </span>
              }
            />
          </>
        }
      />
    </ContentContainer>
  );
}
