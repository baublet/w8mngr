import { getPublicUrl } from "./getPublicUrl";
import { rootService } from "./rootService";

export const uploadDataService = {
  ...rootService,
  getPublicUrl,
};

export { Upload } from "./types";
