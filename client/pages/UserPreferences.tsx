import React from "react";
import { boolean, date, number, object, string } from "yup";

import { getWithDefault } from "../../shared/getWithDefault";
import { GhostButton } from "../components/Button/Ghost";
import { PrimaryButton } from "../components/Button/Primary";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { Form, Input, Toggle } from "../components/Forms";
import { SettingsIcon } from "../components/Icons/Settings";
import { PageHeading } from "../components/Type/PageHeading";
import {
  UserPreferenceType,
  useGetCurrentUserQuery,
  useSaveUserPreferencesMutation,
} from "../generated";
import { useForm } from "../helpers/useForm";
import { useToast } from "../helpers/useToast";

type PreferencesForm = {
  birthday: string;
  faturdayCalories: string;
  faturdayProtein: string;
  faturdayCarbs: string;
  faturdayFat: string;
  faturdays: boolean;
  height: string;
};

const notNaN = (value: any) => (isNaN(value) ? "" : value);

const schema = object().shape({
  birthday: date().optional(),
  faturdayCalories: number().optional(),
  faturdayProtein: number().optional().transform(notNaN),
  faturdayCarbs: number().optional().transform(notNaN),
  faturdayFat: number().optional().transform(notNaN),
  faturdays: boolean().required(),
  height: string().optional(),
});

export function UserPreferences() {
  const { data } = useGetCurrentUserQuery();
  const [loading, setLoading] = React.useState(true);
  const [, setUserPreferences] = React.useState<PreferencesForm>({
    birthday: "",
    faturdayCalories: "",
    faturdayProtein: "",
    faturdayCarbs: "",
    faturdayFat: "",
    faturdays: false,
    height: "",
  });
  const { error, success } = useToast();
  const [saveUserPreferences] = useSaveUserPreferencesMutation({
    awaitRefetchQueries: true,
    refetchQueries: ["GetCurrentUser"],
    onCompleted: (response) => {
      setLoading(false);
      if (response.saveUserPreferences.errors.length > 0) {
        error(response.saveUserPreferences.errors[0]);
      } else {
        success("Preferences saved");
      }
    },
    onError: error,
  });

  const preferencesForm = useForm<PreferencesForm>({ schema });

  const reset = React.useCallback(() => {
    setUserPreferences((defaultPreferences) => {
      preferencesForm.clear();
      preferencesForm.setValues(defaultPreferences);
      return defaultPreferences;
    });
  }, []);
  const submit = React.useCallback(async () => {
    setLoading(true);

    const values = preferencesForm.getValues();

    saveUserPreferences({
      variables: {
        input: {
          preferences: [
            {
              key: "BIRTHDAY",
              value: `${values.birthday}`,
            },
            {
              key: "FATURDAYS",
              value: `${values.faturdays}`,
            },
            {
              key: "FATURDAY_CALORIES",
              value: `${values.faturdayCalories}`,
            },
            {
              key: "FATURDAY_PROTEIN",
              value: `${values.faturdayProtein}`,
            },
            {
              key: "FATURDAY_CARBS",
              value: `${values.faturdayCarbs}`,
            },
            {
              key: "FATURDAY_FAT",
              value: `${values.faturdayFat}`,
            },
            {
              key: "HEIGHT",
              value: `${values.height}`,
            },
            {
              key: "DEFAULT_UNIT",
              value: "IMPERIAL",
            },
          ],
        },
      },
    }).then(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    const preferences = data?.currentUser?.preferences;
    if (!preferences) {
      return;
    }

    setUserPreferences({
      birthday: getPreferenceValue({
        preferences,
        preference: "BIRTHDAY",
        getValue: (value) => getWithDefault(value, ""),
      }),
      faturdayCalories: getPreferenceValue({
        preferences,
        preference: "FATURDAY_CALORIES",
        getValue: (value) => getWithDefault(value, ""),
      }),
      faturdayProtein: getPreferenceValue({
        preferences,
        preference: "FATURDAY_PROTEIN",
        getValue: (value) => getWithDefault(value, ""),
      }),
      faturdayCarbs: getPreferenceValue({
        preferences,
        preference: "FATURDAY_CARBS",
        getValue: (value) => getWithDefault(value, ""),
      }),
      faturdayFat: getPreferenceValue({
        preferences,
        preference: "FATURDAY_FAT",
        getValue: (value) => getWithDefault(value, ""),
      }),
      faturdays: getPreferenceValue({
        preferences,
        preference: "FATURDAYS",
        getValue: (value) => getWithDefault(value, false),
      }),
      height: getPreferenceValue({
        preferences,
        preference: "HEIGHT",
        getValue: (value) => getWithDefault(value, ""),
      }),
    });

    reset();
    setLoading(false);
  }, [data]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading icon={<SettingsIcon />}>User Preferences</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <Form
              loading={loading}
              className="flex flex-col gap-12 w-full"
              onSubmit={submit}
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 flex flex-col gap-2">
                  <Input
                    label="Height"
                    placeholder={`e.g., 5 ft 3 inches`}
                    type="text"
                    value={preferencesForm.getValue("height")}
                    onChange={preferencesForm.getHandler("height")}
                  />
                  <FeatureDescription>
                    For calculating calories burned and converting steps to
                    approximate distance
                  </FeatureDescription>
                </div>
                <div className="md:w-1/2 flex flex-col gap-2">
                  <Input
                    label="Birthday"
                    placeholder={`e.g., October 13, 1982`}
                    type="text"
                    value={preferencesForm.getValue("birthday")}
                    onChange={preferencesForm.getHandler("birthday")}
                  />
                  <FeatureDescription>
                    For calculating calories burned, nutritional goals, and
                    activity targets
                  </FeatureDescription>
                </div>
              </div>
              <div className="flex gap-4 items-start sm:items-center w-full flex-col sm:flex-row">
                <div className="flex flex-col gap-2 items-start w-72">
                  <div>
                    <Toggle
                      id="faturdays"
                      label="Faturdays"
                      labelPosition="right"
                      onChange={preferencesForm.getHandler("faturdays")}
                      value={preferencesForm.getValue("faturdays")}
                    />
                  </div>
                  <FeatureDescription>
                    Quickly log your cheat days using the following defaults so
                    you can focus on the future
                  </FeatureDescription>
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
                          "faturdayCalories",
                        )}
                        value={preferencesForm.getValue("faturdayCalories")}
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
                        value={preferencesForm.getValue("faturdayFat")}
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
                        value={preferencesForm.getValue("faturdayCarbs")}
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
                        value={preferencesForm.getValue("faturdayProtein")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <GhostButton type="button" onClick={reset}>
                  Reset
                </GhostButton>
                <PrimaryButton type="submit" disabled={loading}>
                  Save Preferences
                </PrimaryButton>
              </div>
            </Form>
          }
        />
      </ContentContainer>
    </div>
  );
}

function FeatureDescription({ children }: React.PropsWithChildren<{}>) {
  return <div className="text-xs text-slate-500">{children}</div>;
}

function getPreferenceValue<T>({
  preference,
  preferences,
  getValue,
}: {
  preferences: {
    key: UserPreferenceType;
    value?: any;
  }[];
  preference: UserPreferenceType;
  getValue: (value?: any) => T;
}): T {
  const preferenceElement = preferences.find((pref) => pref.key === preference);
  const preferenceValue = preferenceElement?.value;
  return getValue(preferenceValue);
}
