import crypto from "crypto";

import { ulid } from "ulid";

import { assertIsError, assertIsTruthy } from "../../../shared";
import { config, dbService } from "../../config";
import { Context } from "../../createContext";
import { uploadDataService } from "../upload";
import { UploadToken } from "./type";

export async function create({
  context,
  count,
}: {
  context: Context;
  count: number;
}): Promise<Error | (UploadToken & { uploadId: string })[]> {
  const CLOUDINARY_API_KEY = config.get("CLOUDINARY_API_KEY");
  const CLOUDINARY_API_SECRET = config.get("CLOUDINARY_API_SECRET");
  const CLOUDINARY_URL = config.get("CLOUDINARY_URL");
  const userId = context.getCurrentUserId();
  assertIsTruthy(userId);
  const db = await context.services.get(dbService);
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
        new Promise<void>(async (resolve) => {
          const unixTime = `${Date.now()}`.substr(0, 10);
          const publicId = ulid();
          const folder =
            config.get("NODE_ENV") === "production" ? "prod" : "non-prod";

          const signature = `folder=${folder}&public_id=${publicId}&timestamp=${unixTime}${CLOUDINARY_API_SECRET}`;
          const shasum = crypto.createHash("sha1");
          shasum.update(signature);
          const signedSignature = shasum.digest("hex");

          const upload = await uploadDataService.create(context, {
            publicId: `${folder}/${publicId}`,
            userId,
          });

          tokens.push({
            uploadId: upload.id,
            postUrl: CLOUDINARY_URL,
            publicId,
            signature: signedSignature,
            timestamp: unixTime,
            apiKey: CLOUDINARY_API_KEY,
            folder,
          });

          resolve();
        })
      );
    }

    await Promise.all(promises);

    await db.commit();
    return tokens;
  } catch (error) {
    await db.rollback(error);
    assertIsError(error);
    return error;
  }
}
