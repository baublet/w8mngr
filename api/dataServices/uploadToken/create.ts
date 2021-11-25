import crypto from "crypto";
import { ulid } from "ulid";

import { Context } from "../../createContext";
import { UploadToken } from "./type";
import { uploadDataService } from "../upload";
import { dbService } from "../../config";
import { assertIsError, assertIsTruthy } from "../../../shared";

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/baublet/auto/upload";

export async function create({
  context,
  count,
}: {
  context: Context;
  count: number;
}): Promise<Error | UploadToken[]> {
  const userId = context.currentUser?.id;
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
    const tokens: UploadToken[] = [];

    const promises: Promise<void>[] = [];
    for (let i = 0; i < maximizedCount; i++) {
      promises.push(
        new Promise<void>(async (resolve) => {
          const unixTime = `${Date.now()}`.substr(0, 10);
          const publicId = ulid();
          const folder =
            process.env.NODE_ENV === "production" ? "prod" : "non-prod";

          const signature = `folder=${folder}&public_id=${publicId}&timestamp=${unixTime}${CLOUDINARY_API_SECRET}`;
          const shasum = crypto.createHash("sha1");
          shasum.update(signature);
          const signedSignature = shasum.digest("hex");

          tokens.push({
            postUrl: CLOUDINARY_URL,
            publicId,
            signature: signedSignature,
            timestamp: unixTime,
            apiKey: CLOUDINARY_API_KEY,
            folder,
          });

          await uploadDataService.create(context, {
            publicId: `${folder}/${publicId}`,
            userId,
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
