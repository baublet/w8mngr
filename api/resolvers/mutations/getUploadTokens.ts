import { log } from "../../config/log.js";
import { uploadTokenDataService } from "../../dataServices/uploadToken/index.js";
import { MutationResolvers } from "../../generated.js";

export const getUploadTokens: MutationResolvers["getUploadTokens"] = async (
  parent,
  { input },
  context
) => {
  const result = await uploadTokenDataService.create({
    context,
    count: input.count,
  });

  if (result instanceof Error) {
    log(context, "error", "Error creating upload tokens", {
      result,
    });
    return {
      errors: [result.message],
      tokens: [],
    };
  }

  return {
    errors: [],
    tokens: result,
  };
};
