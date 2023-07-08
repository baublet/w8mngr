import { uploadDataService } from "../dataServices/upload";
import { QueryResolvers } from "../generated";

export const upload: QueryResolvers["upload"] = (
  parent,
  { input },
  context
) => {
  return uploadDataService.findOneOrFailBy(context, (q) => {
    const id = input?.id;

    let query = q;
    if (id) {
      query = query.where("id", "=", id);
    }

    const publicId = input?.publicId;
    if (publicId) {
      query = query.where("publicId", "=", publicId);
    }

    return query;
  });
};
