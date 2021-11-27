import { UploadResolvers } from "../../graphql-types";
import { uploadDataService } from "../../dataServices";
import { log } from "../../config";

export const publicUrl: UploadResolvers["publicUrl"] = (
  parent,
  { input },
  context
) => {
  try {
    return uploadDataService.getPublicUrl(context, {
      uploadId: parent.id,
      type: input?.type,
    });
  } catch (error) {
    log("error", "Unknown error generating a public URL", {
      error,
    });
    return "";
  }
};
