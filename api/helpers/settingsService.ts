import { ServiceContainer } from "@baublet/service-container";

import { contextService } from "../createContext";
import { userPreferenceDataService } from "../dataServices";
import { Unit } from "../generated";

type Settings = {
  defaultDistanceMeasurement: Unit[];
  defaultTemporalMeasurement: Unit[];
  defaultMassMeasurement: Unit[];
};

export async function settingsService(
  services: ServiceContainer
): Promise<Settings> {
  const context = services.get(contextService);

  const userId = context.getCurrentUserId();

  if (!userId) {
    return getDefaultImperialMeasurements();
  }
  
  const userSettings = await userPreferenceDataService.findBy(context, (q) =>
    q.where("userId", "=", userId).andWhere("preference", "=", "DEFAULT_UNIT")
  );

  const defaultUnit =
    userSettings.length > 0 ? userSettings[0].value : "imperial";

  if (defaultUnit === "metric") {
    return getDefaultMetricMeasurements();
  }
  
  return getDefaultImperialMeasurements();
}

function getDefaultImperialMeasurements(): Settings {
  return {
    defaultDistanceMeasurement: ["MILES", "YARDS", "FEET"],
    defaultMassMeasurement: ["LBS"],
    defaultTemporalMeasurement: ["HOURS", "MINUTES", "SECONDS"],
  };
}

function getDefaultMetricMeasurements(): Settings {
  return {
    defaultDistanceMeasurement: ["KILOMETERS", "METERS"],
    defaultMassMeasurement: ["KILOGRAMS"],
    defaultTemporalMeasurement: ["HOURS", "MINUTES", "SECONDS"],
  };
}
