import { getPublicUrl } from "./getPublicUrl";
import { rootService } from "./rootService";

export const uploadDataService = {
  ...rootService,
  getPublicUrl,
};

export { UploadEntity } from "./types";
