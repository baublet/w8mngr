import axios from "axios";

import { getWithDefault } from "../../shared/getWithDefault";
import {
  GetUploadTokensDocument,
  GetUploadTokensMutationResult,
  GetUploadTokensMutationVariables,
  UpdateUploadDataDocument,
  UpdateUploadDataMutationResult,
  UpdateUploadDataMutationVariables,
} from "../generated";
import { apolloClientService } from "./apolloClientService";

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
  previewUrl: string;
  smallUrl: string;
  extension: string;
  uploadId: string;
};

export async function uploadFiles({
  files,
}: {
  files: FileInput[];
}): Promise<UploadedFile[]> {
  try {
    const client = await window.w8mngrServiceContainer.get(apolloClientService);
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
            uploadedFiles.push({
              id: file.id,
              previewUrl: "",
              smallUrl: "",
              publicId: result.data["public_id"],
              extension: result.data["format"],
              uploadId: token.uploadId,
            });
          })
          .catch((err) => {
            console.error("Upload error", err);
          });
      })
    );

    await Promise.all(
      uploadedFiles.map(async (file) => {
        const result = await client.mutate<
          UpdateUploadDataMutationResult["data"],
          UpdateUploadDataMutationVariables
        >({
          mutation: UpdateUploadDataDocument,
          variables: {
            input: {
              id: file.uploadId,
              extension: file.extension,
            },
          },
        });

        file.previewUrl = result.data?.saveUploadData.upload.preview || "";
        file.smallUrl = result.data?.saveUploadData.upload.small || "";
      })
    );

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading file", error);
    return [];
  }
}
