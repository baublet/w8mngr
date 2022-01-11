import { MutationResolvers } from "../../graphql-types";
import { uploadDataService } from "../../dataServices";
import { errors } from "api/helpers";

export const saveUploadData: MutationResolvers["saveUploadData"] = async (
  parent,
  { input },
  context
) => {
  const currentUserId = context.getCurrentUserId(true);

  await uploadDataService.update(
    context,
    (q) => {
      const id = input.id;
      const publicId = input.publicId;

      q.where("userId", "=", currentUserId);

      if (id) {
        q.andWhere("id", "=", id);
      }

      if (publicId) {
        q.andWhere("publicId", "=", publicId);
      }
    },
    {
      entityId: input.entityId,
      entityType: input.entityType,
      extension: input.extension,
      updatedAt: new Date(),
    }
  );

  const upload = await uploadDataService.findOneOrFail(context, (q) => {
    const id = input.id;
    const publicId = input.publicId;

    q.where("userId", "=", currentUserId);

    if (id) {
      q.andWhere("id", "=", id);
    }

    if (publicId) {
      q.andWhere("publicId", "=", publicId);
    }
  });

  return {
    upload,
  };
};
