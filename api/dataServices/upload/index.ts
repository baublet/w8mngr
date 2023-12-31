import { getPublicUrl } from "./getPublicUrl.js";
import { rootService } from "./rootService.js";

export const uploadDataService = {
  ...rootService,
  getPublicUrl,
};

export type { UploadEntity } from "./types.js";
