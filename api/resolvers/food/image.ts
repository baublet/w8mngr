import { FoodResolvers } from "../../graphql-types";
import { uploadDataService } from "../../dataServices";

export const foodImage: 
  FoodResolvers["image"] = (parent: any, args, context) => {
  const imageUploadId = parent.imageUploadId;
  if (!imageUploadId) {
    return Promise.resolve(undefined);
  }
  try {
    return uploadDataService.findOneOrFail(context, (q) =>
      q.where("id", "=", imageUploadId)
    );
  } catch (e) {
    return Promise.resolve(undefined);
  }
};
