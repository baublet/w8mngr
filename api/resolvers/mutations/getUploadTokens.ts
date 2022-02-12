import { log } from "../../config/log";
import { uploadTokenDataService } from "../../dataServices";
import { MutationResolvers } from "../../generated";

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
    log("error", "Error creating upload tokens", {
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
