// AUTOMATICALLY GENERATED FILE. GENERATE WITH: pnpm db:generateTypes

import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export interface _CfKV {
  key: string;
  value: Buffer | null;
}

export interface Activity {
  activityLibraryId: string | null;
  archived: Generated<number>;
  createdAt: Generated<number>;
  description: string | null;
  exrx: string | null;
  id: string;
  intensity: Generated<number | null>;
  legacyId: number | null;
  name: string | null;
  popularity: Generated<number | null>;
  type: string | null;
  updatedAt: Generated<number>;
  userId: string;
}

export interface ActivityLibrary {
  archived: Generated<number>;
  createdAt: Generated<number>;
  description: string | null;
  exrx: string | null;
  id: string;
  intensity: Generated<number>;
  name: string;
  popularity: Generated<number>;
  type: string;
  updatedAt: Generated<number>;
}

export interface ActivityLibraryActivityMuscle {
  activityLibraryActivityId: string;
  id: string;
  muscle: string;
}

export interface ActivityLog {
  activityId: string;
  archived: Generated<number>;
  createdAt: Generated<number>;
  day: string;
  id: string;
  reps: Generated<number>;
  updatedAt: Generated<number>;
  userId: string;
  work: Generated<number>;
}

export interface ActivityMuscle {
  activityId: string;
  id: string;
  muscle: string;
}

export interface D1Migrations {
  applied_at: Generated<string>;
  id: Generated<number | null>;
  name: string | null;
}

export interface Email {
  createdAt: Generated<number>;
  history: Generated<string>;
  id: string;
  idempotenceKey: string;
  payload: Generated<string>;
  sent: Generated<number>;
  templateId: string;
  toEmail: string;
  toUserId: string | null;
  updatedAt: Generated<number>;
}

export interface Food {
  archived: Generated<number>;
  createdAt: Generated<number>;
  description: string | null;
  id: string;
  imageUploadId: string | null;
  legacyId: number;
  name: string;
  ndbno: string | null;
  popularity: Generated<number>;
  updatedAt: Generated<number>;
  userId: string;
}

export interface FoodLog {
  calories: number | null;
  carbs: number | null;
  createdAt: Generated<number>;
  day: string;
  description: string;
  fat: number | null;
  id: string;
  protein: number | null;
  updatedAt: Generated<number>;
  userId: string;
}

export interface FoodLogFood {
  createdAt: Generated<number>;
  day: string;
  foodId: string;
  id: string;
  userId: string;
}

export interface FoodMeasurement {
  amount: Generated<number>;
  calories: Generated<number>;
  carbs: Generated<number>;
  createdAt: Generated<number>;
  fat: Generated<number>;
  foodId: string;
  id: string;
  measurement: string;
  popularity: Generated<number>;
  protein: Generated<number>;
  updatedAt: Generated<number>;
  userId: string;
}

export interface Token {
  clientId: string;
  createdAt: Generated<number>;
  expires: number;
  id: string;
  tokenDigest: string;
  type: string;
  updatedAt: Generated<number>;
  userAccountId: string;
}

export interface Upload {
  createdAt: Generated<number>;
  entityId: string | null;
  entityType: string | null;
  extension: string | null;
  id: string;
  publicId: string;
  updatedAt: Generated<number>;
  userId: string;
}

export interface User {
  createdAt: Generated<number>;
  id: string;
  legacyPreferences: string | null;
  preferredName: string | null;
  role: string | null;
}

export interface UserAccount {
  createdAt: Generated<number>;
  id: string;
  passwordHash: string | null;
  rememberTokenDigest: string | null;
  source: string;
  sourceIdentifier: string | null;
  tokenDigest: string | null;
  updatedAt: Generated<number>;
  userId: string;
  verified: Generated<number | null>;
}

export interface UserPreference {
  createdAt: Generated<number>;
  id: string;
  preference: string;
  updatedAt: Generated<number>;
  userId: string;
  value: string;
}

export interface WeightLog {
  createdAt: Generated<number>;
  day: string;
  id: string;
  updatedAt: Generated<number>;
  userId: string;
  weight: number;
}

export interface DB {
  _cf_KV: _CfKV;
  activity: Activity;
  activityLibrary: ActivityLibrary;
  activityLibraryActivityMuscle: ActivityLibraryActivityMuscle;
  activityLog: ActivityLog;
  activityMuscle: ActivityMuscle;
  d1_migrations: D1Migrations;
  email: Email;
  food: Food;
  foodLog: FoodLog;
  foodLogFood: FoodLogFood;
  foodMeasurement: FoodMeasurement;
  token: Token;
  upload: Upload;
  user: User;
  userAccount: UserAccount;
  userPreference: UserPreference;
  weightLog: WeightLog;
}
