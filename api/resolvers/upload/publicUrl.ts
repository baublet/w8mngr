import { log } from "../../config/log.js";
import { uploadDataService } from "../../dataServices/upload/index.js";
import { UploadResolvers } from "../../generated.js";

export const publicUrl: UploadResolvers["publicUrl"] = (
  parent,
  { input },
  context,
) => {
  try {
    return uploadDataService.getPublicUrl(context, {
      uploadId: parent.id,
      type: input?.type,
    });
  } catch (error) {
    log(context, "error", "Unknown error generating a public URL", {
      error,
    });
    return "";
  }
};
