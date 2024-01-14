import { uploadDataService } from "../../dataServices/upload/index.js";
import { MutationResolvers } from "../../generated.js";

export const saveUploadData: MutationResolvers["saveUploadData"] = async (
  parent,
  { input },
  context,
) => {
  const currentUserId = context.getCurrentUserId(true);

  await uploadDataService.update(
    context,
    (q) => {
      const id = input.id;
      const publicId = input.publicId;

      q.where("userId", "=", currentUserId);

      if (id) {
        q.where("id", "=", id);
      }

      if (publicId) {
        q.where("publicId", "=", publicId);
      }

      return q;
    },
    {
      entityId: input.entityId,
      entityType: input.entityType,
      extension: input.extension,
      updatedAt: Date.now(),
    },
  );

  const upload = await uploadDataService.findOneOrFailBy(context, (q) => {
    const id = input.id;
    const publicId = input.publicId;

    q.where("userId", "=", currentUserId);

    if (id) {
      q.where("id", "=", id);
    }

    if (publicId) {
      q.where("publicId", "=", publicId);
    }

    return q;
  });

  return {
    upload,
  };
};
