import { createSha1Digest } from "../../authentication/createDigest.js";
import { configService } from "../../config/config.js";
import { Context } from "../../createContext.js";
import { UploadUrlType } from "../../generated.js";
import { rootService } from "./rootService.js";

const TRANSFORMATIONS_MAP: Record<
  UploadUrlType,
  { transformationsString: string }
> = {
  MEDIUM_SQUARE: {
    transformationsString: "ar_1,w_512,c_lfill",
  },
  PREVIEW: {
    transformationsString: "ar_1,w_24,c_lfill",
  },
  SMALL: {
    transformationsString: "ar_1,w_64,c_lfill",
  },
} as const;

export async function getPublicUrl(
  context: Context,
  { type = "PREVIEW", uploadId }: { uploadId: string; type?: UploadUrlType },
): Promise<string> {
  if (!context.services.get(configService).get("CLOUDINARY_API_SECRET")) {
    throw new Error(`No CLOUDINARY_API_SECRET in environment variables...`);
  }

  const currentUserId = context.getCurrentUserId();
  const upload = await rootService.findOneOrFailBy(context, (q) => {
    q.where("id", "=", uploadId);
    if (currentUserId) {
      q.where("userId", "=", currentUserId);
    }
    return q;
  });
  const publicId = upload.publicId;
  const transformationsUrlPart =
    TRANSFORMATIONS_MAP[type].transformationsString;
  const extension = upload.extension || "jpg";
  const fileName = `${publicId}.${extension}`;
  const toSign = [transformationsUrlPart, fileName].join("/");
  const signedSignature = await createSha1Digest(
    toSign + context.services.get(configService).get("CLOUDINARY_API_SECRET"),
  );

  const signature =
    "s--" + Buffer.from(signedSignature).toString("base64").substr(0, 8) + "--";

  const finalUrl = `https://res.cloudinary.com/baublet/image/upload/${signature}/${toSign}`;

  return finalUrl;
}
