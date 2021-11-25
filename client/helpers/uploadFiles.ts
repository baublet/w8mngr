import axios from "axios";

import { getWithDefault } from "../../shared";
import { apolloClientService } from "./apolloClientService";
import {
  GetUploadTokensDocument,
  GetUploadTokensMutationVariables,
  GetUploadTokensMutationResult,
} from "../generated";

type FileInput = {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
};

type UploadedFile = {
  id: string;
  publicId: string;
  publicUrl: string;
};

export async function uploadFiles({
  files,
}: {
  files: FileInput[];
}): Promise<UploadedFile[]> {
  try {
    const getClient = await window.w8mngrServiceContainer.get(
      apolloClientService
    );
    const client = getClient();
    const count = files.length;

    const result = await client.mutate<
      GetUploadTokensMutationResult["data"],
      GetUploadTokensMutationVariables
    >({
      mutation: GetUploadTokensDocument,
      variables: {
        input: {
          count,
        },
      },
    });

    const tokens = getWithDefault(result.data?.getUploadTokens.tokens, []);

    if (
      result.errors ||
      (result.data?.getUploadTokens.errors.length || 0) > 0
    ) {
      console.log({ errors: result.errors });
      return [];
    }

    const uploadedFiles: UploadedFile[] = [];

    await Promise.all(
      files.map(async (file, index) => {
        const token = tokens[index];

        const formData = new FormData();
        formData.append("file", file.file);
        formData.append("api_key", token.apiKey);
        formData.append("public_id", token.publicId);
        formData.append("timestamp", token.timestamp);
        formData.append("folder", token.folder);
        formData.append("signature", token.signature);

        return axios
          .post(token.postUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((result) => {
            console.log({ resultData: result.data });
            uploadedFiles.push({
              id: file.id,
              publicUrl: result.data["secure_url"],
              publicId: result.data["public_id"],
            });
          })
          .catch((err) => {
            console.error("Upload error", err);
          });
      })
    );

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading file", error);
    return [];
  }
}
