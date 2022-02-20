import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { Form, Input, Toggle } from "../components/Forms";
import { PageHeading } from "../components/Type/PageHeading";
import { useForm } from "../helpers";

export function UserPreferences() {
  const preferencesForm = useForm<{
    preferredName: string;
    birthday: string;
    faturdayCalories: string;
    faturdayProtein: string;
    faturdayCarbs: string;
    faturdayFat: string;
    faturdays: boolean;
    height: string;
  }>();

  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading>User Preferences</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <Form loading={false} className="flex flex-col gap-8 w-full">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <Input
                    label="Height"
                    placeholder={`e.g., 5 ft 3 inches`}
                    type="text"
                    onChange={preferencesForm.getHandler("height")}
                  />
                </div>
                <div className="md:w-1/2">
                  <Input
                    label="Birthday"
                    placeholder={`e.g., October 13, 1982`}
                    type="text"
                    onChange={preferencesForm.getHandler("birthday")}
                  />
                </div>
              </div>
              <div className="flex gap-8 items-center w-full">
                <div>
                  <Toggle
                    id="faturdays"
                    label="Faturdays"
                    labelPosition="right"
                    onChange={preferencesForm.getHandler("faturdays")}
                  />
                </div>
                <div className="w-full flex gap-2 flex-col md:flex-row">
                  <div className="w-full md:w-1/2">
                    <div className="w-full">
                      <Input
                        className="w-full"
                        disabled={!preferencesForm.getValue("faturdays")}
                        label="Faturday Calories"
                        placeholder="e.g., 2000"
                        type="text"
                        onChange={preferencesForm.getHandler(
                          "faturdayCalories"
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="w-1/3">
                      <Input
                        className="w-full"
                        disabled={!preferencesForm.getValue("faturdays")}
                        label="Fat"
                        placeholder="e.g., 100"
                        type="text"
                        onChange={preferencesForm.getHandler("faturdayFat")}
                      />
                    </div>
                    <div className="w-1/3">
                      <Input
                        className="w-full"
                        disabled={!preferencesForm.getValue("faturdays")}
                        label="Carbs"
                        placeholder="e.g., 400"
                        type="text"
                        onChange={preferencesForm.getHandler("faturdayCarbs")}
                      />
                    </div>
                    <div className="w-1/3">
                      <Input
                        className="w-full"
                        disabled={!preferencesForm.getValue("faturdays")}
                        label="Protein"
                        placeholder="e.g., 200"
                        type="text"
                        onChange={preferencesForm.getHandler("faturdayProtein")}
                      />
                    </div>{" "}
                  </div>
                </div>
              </div>
            </Form>
          }
        />
      </ContentContainer>
    </div>
  );
}
