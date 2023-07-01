import { uploadDataService } from "../dataServices/upload";
import { QueryResolvers } from "../generated";

export const upload: QueryResolvers["upload"] = (
  parent,
  { input },
  context
) => {
  return uploadDataService.findOneOrFail(context, (q) => {
    const id = input?.id;
    if (id) {
      q.andWhere("id", "=", id);
    }

    const publicId = input?.publicId;
    if (publicId) {
      q.andWhere("publicId", "=", publicId);
    }
  });
};
