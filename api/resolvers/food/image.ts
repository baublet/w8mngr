import { uploadDataService } from "../../dataServices/upload/index.js";
import { FoodResolvers } from "../../generated.js";

export const foodImage: FoodResolvers["image"] = (
  parent: any,
  args,
  context
) => {
  const imageUploadId = parent.imageUploadId;
  if (!imageUploadId) {
    return Promise.resolve(undefined);
  }
  try {
    return uploadDataService.findOneOrFail(context, imageUploadId);
  } catch (e) {
    return Promise.resolve(undefined);
  }
};
