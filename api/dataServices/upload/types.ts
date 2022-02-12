import { UploadEntityType } from "../../generated";

export type Upload = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  publicId: string;
  entityType?: UploadEntityType;
  entityId?: string;
  extension?: string;
};
