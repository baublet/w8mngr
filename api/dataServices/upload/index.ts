import { createDataService } from "../createDataService";
import { getPublicUrl } from "./getPublicUrl";
import { getQuery } from "./query";

export const uploadDataService = {
  ...createDataService(getQuery, "Upload"),
  getPublicUrl,
};

export { Upload } from "./types";
