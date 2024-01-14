import crypto from "crypto";

import { assertIsTruthy } from "../../../shared/assertIsTruthy.js";
import { assertIsError } from "../../../shared/assertIsError.js";
import { configService } from "../../config/config.js";
import { Context } from "../../createContext.js";
import { uploadDataService } from "../upload/index.js";
import { UploadToken } from "./type.js";
import { getUniqueId } from "../../../shared/getUniqueId.js";
import { promiseHandler } from "../../../shared/promiseHandler.js";

export async function create({
  context,
  count,
}: {
  context: Context;
  count: number;
}): Promise<Error | (UploadToken & { uploadId: string })[]> {
  const config = context.services.get(configService);
  const CLOUDINARY_API_KEY = config.get("CLOUDINARY_API_KEY");
  const CLOUDINARY_API_SECRET = config.get("CLOUDINARY_API_SECRET");
  const CLOUDINARY_URL = config.get("CLOUDINARY_URL");
  const userId = context.getCurrentUserId();
  assertIsTruthy(userId);
  try {
    if (!CLOUDINARY_API_KEY) {
      throw new Error(`No CLOUDINARY_API_KEY in environment variables...`);
    }
    if (!CLOUDINARY_API_SECRET) {
      throw new Error(`No CLOUDINARY_API_SECRET in environment variables...`);
    }

    const maximizedCount = Math.min(count, 25);
    const tokens: (UploadToken & { uploadId: string })[] = [];

    const promises: Promise<void>[] = [];
    for (let i = 0; i < maximizedCount; i++) {
      promises.push(
        promiseHandler(async () => {
          const unixTime = `${Date.now()}`.substr(0, 10);
          const publicId = getUniqueId();
          const folder =
            config.get("NODE_ENV") === "production" ? "prod" : "non-prod";

          const signature = `folder=${folder}&public_id=${publicId}&timestamp=${unixTime}${CLOUDINARY_API_SECRET}`;
          const shasum = crypto.createHash("sha1");
          shasum.update(signature);
          const signedSignature = shasum.digest("hex");

          const results = await uploadDataService.create(context, [
            {
              publicId: `${folder}/${publicId}`,
              userId,
            },
          ]);
          const upload = results[0];
          assertIsTruthy(upload, "Expected upload create to return a record");

          tokens.push({
            uploadId: upload.id,
            postUrl: CLOUDINARY_URL,
            publicId,
            signature: signedSignature,
            timestamp: unixTime,
            apiKey: CLOUDINARY_API_KEY,
            folder,
          });
        }),
      );
    }

    await Promise.all(promises);
    return tokens;
  } catch (error) {
    assertIsError(error);
    return error;
  }
}
