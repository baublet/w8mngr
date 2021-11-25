import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const uploadDataService = {
  ...createDataService(getQuery, "Upload"),
};

export { Upload } from "./types";
