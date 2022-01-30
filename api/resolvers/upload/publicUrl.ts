import { log } from "../../config/log";
import { uploadDataService } from "../../dataServices";
import { UploadResolvers } from "../../graphql-types";

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
