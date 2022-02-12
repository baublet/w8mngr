export type UserPreferenceEntity = {
  id: string;
  userId: string;
  preference:
    | "birthday"
    | "height"
    | "defaultUnit"
    | "faturdays"
    | "faturdayCalories";
  value: string;
  createdAt: Date;
  updatedAt: Date;
};
