import { getVisualizationData } from "./getVisualizationData.js";
import { rootService } from "./rootService.js";
import { saveMutation } from "./saveMutation.js";

export const weightLogDataService = {
  ...rootService,
  getVisualizationData,
  saveMutation,
};

export type { WeightLogEntity } from "./types.js";
