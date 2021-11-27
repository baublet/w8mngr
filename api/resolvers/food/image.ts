import { FoodResolvers } from "../../graphql-types";
import { uploadDataService } from "../../dataServices";
import { Context } from "api/createContext";

export const foodImage: Required<
  FoodResolvers<
    Context,
    {
      imageUploadId?: string;
    }
  >
>["image"] = (parent, args, context) => {
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
