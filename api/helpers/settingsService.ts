import { Unit } from "../generated";

type Settings = {
  defaultDistanceMeasurement: Unit[];
  defaultTemporalMeasurement: Unit[];
  defaultMassMeasurement: Unit[];
};

export function settingsService() {
  return (): Settings => ({
    defaultDistanceMeasurement: ["MILES"],
    defaultMassMeasurement: ["LBS"],
    defaultTemporalMeasurement: ["HOURS", "MINUTES", "SECONDS"],
  });
}
