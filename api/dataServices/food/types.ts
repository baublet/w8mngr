export type FoodEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  name: string;
  description?: string;
  imageUploadId?: string;
  legacyId?: number;
  ndbno?: string;
};
