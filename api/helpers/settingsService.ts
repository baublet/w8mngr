import { Unit } from "../graphql-types";

type Settings = {
  defaultDistanceMeasurement: Unit;
  defaultTemporalMeasurement: Unit;
  defaultMassMeasurement: Unit;
};

export function settingsService() {
  return (): Settings => ({
    defaultDistanceMeasurement: "MILES",
    defaultMassMeasurement: "LBS",
    defaultTemporalMeasurement: "SECONDS",
  });
}
