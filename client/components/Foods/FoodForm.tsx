import React from "react";

import { Input, MultilineInput } from "../Forms";
import { Spacer } from "../Spacer";
import { SecondaryButton } from "../Button/Secondary";
import { ContentContainer } from "../Containers/ContentContainer";
import { ContentLayout } from "../Containers/ContentLayout";

import { useForm } from "../../helpers";
import { Upload } from "../Forms/Upload";
import { SideBarHeading } from "../Type/SideBarHeading";

export function FoodForm({ id }: { id?: string }) {
  const foodFormData = useForm<{
    name: string;
    description: string;
  }>();
  return (
    <ContentContainer>
      <ContentLayout
        mainContent={
          <div className="flex w-full flex-col">
            <Input
              placeholder="Food name"
              type="text"
              label="Name"
              onChange={foodFormData.getHandler("name")}
            />
            <Spacer size="s" />
            <MultilineInput
              placeholder="Description"
              type="text"
              label="Description"
              onChange={foodFormData.getHandler("description")}
            />
            <Spacer />
            <div className="flex w-full gap-4 justify-end">
              <SecondaryButton>Save Food</SecondaryButton>
            </div>
          </div>
        }
        sideContent={
          <>
            <SideBarHeading>Image</SideBarHeading>
            <Upload />
          </>
        }
      />
    </ContentContainer>
  );
}
