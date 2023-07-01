import { getVisualizationData } from "./getVisualizationData";
import { rootService } from "./rootService";
import { saveMutation } from "./saveMutation";

export const weightLogDataService = {
  ...rootService,
  getVisualizationData,
  saveMutation,
};

export type { WeightLogEntity } from "./types";
