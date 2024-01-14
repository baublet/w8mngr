-- Migration number: 0000 	 2023-06-23T03:58:58.583Z
CREATE TABLE activity (
  archived INTEGER NOT NULL DEFAULT 0,
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  name TEXT,
  description TEXT,
  exrx TEXT,
  type TEXT,
  intensity INTEGER DEFAULT 0,
  popularity INTEGER DEFAULT 0,
  "activityLibraryId" TEXT,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "legacyId" INTEGER,
  CONSTRAINT activity_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX activity_archived_index ON activity (archived ASC);

CREATE INDEX activity_userid_index ON activity ("userId" ASC);

CREATE INDEX activity_type_index ON activity (type ASC);

CREATE INDEX activity_popularity_index ON activity (popularity ASC);

CREATE INDEX activity_legacyid_index ON activity ("legacyId" ASC);

CREATE UNIQUE INDEX activity_legacyid_unique ON activity ("legacyId" ASC);

CREATE TABLE "activityLibrary" (
  archived INTEGER NOT NULL DEFAULT 0,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NULL,
  exrx TEXT NULL,
  type TEXT NOT NULL,
  intensity INTEGER NOT NULL DEFAULT 0,
  popularity INTEGER NOT NULL DEFAULT 0,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT activity_library_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX activity_library_archived_index ON "activityLibrary" (archived ASC);

CREATE INDEX activity_library_type_index ON "activityLibrary" (type ASC);

CREATE INDEX activity_library_popularity_index ON "activityLibrary" (popularity ASC);

CREATE TABLE "activityLibraryActivityMuscle" (
  id TEXT NOT NULL,
  "activityLibraryActivityId" TEXT NOT NULL,
  muscle TEXT NOT NULL,
  CONSTRAINT activity_library_muscle_pkey PRIMARY KEY (id ASC)
);

CREATE TABLE "activityLog" (
  id TEXT NOT NULL,
  "activityId" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  day TEXT NOT NULL,
  reps INTEGER NOT NULL DEFAULT 0,
  "work" INTEGER NOT NULL DEFAULT 0,
  archived INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT activity_log_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX activity_log_activityid_index ON "activityLog" ("activityId" ASC);

CREATE INDEX activity_log_userid_index ON "activityLog" ("userId" ASC);

CREATE INDEX activity_log_day_index ON "activityLog" (day ASC);

CREATE INDEX activity_log_archived_index ON "activityLog" (archived ASC);

CREATE TABLE "activityMuscle" (
  id TEXT NOT NULL,
  "activityId" TEXT NOT NULL,
  muscle TEXT NOT NULL,
  CONSTRAINT activity_muscle_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX activity_muscle_activityid_index ON "activityMuscle" ("activityId" ASC);

CREATE INDEX activity_muscle_muscle_index ON "activityMuscle"(muscle ASC);

CREATE TABLE email (
  id TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent INTEGER NOT NULL DEFAULT 0,
  "toEmail" TEXT NOT NULL,
  "toUserId" TEXT NULL,
  "templateId" TEXT NOT NULL,
  payload TEXT NOT NULL DEFAULT '{}',
  history TEXT NOT NULL DEFAULT '[]',
  "idempotenceKey" TEXT NOT NULL,
  CONSTRAINT email_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX email_sent_index ON email (sent ASC);

CREATE TABLE food (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  description TEXT NULL,
  "imageUploadId" TEXT NULL,
  "legacyId" INTEGER NOT NULL,
  ndbno TEXT NULL,
  popularity INTEGER NOT NULL DEFAULT 0,
  archived INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT food_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX food_userid_index ON food ("userId" ASC);

CREATE INDEX food_legacyid_index ON food ("legacyId" ASC);

CREATE INDEX food_ndbno_index ON food (ndbno ASC);

CREATE TABLE "foodLog" (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  day TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  description TEXT NOT NULL,
  calories INTEGER,
  fat INTEGER,
  carbs INTEGER,
  protein INTEGER,
  CONSTRAINT food_log_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX food_log_userid_index ON "foodLog" ("userId" ASC);

CREATE INDEX food_log_day_index ON "foodLog" (day ASC);

CREATE TABLE "foodLogFood" (
  id TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  "foodId" TEXT NOT NULL,
  day TEXT NOT NULL,
  CONSTRAINT food_log_food_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX food_log_food_userid_index ON "foodLogFood" ("userId" ASC);

CREATE INDEX food_log_food_foodid_index ON "foodLogFood" ("foodId" ASC);

CREATE INDEX food_log_food_day_index ON "foodLogFood" (day ASC);

CREATE TABLE "foodMeasurement" (
  id TEXT NOT NULL,
  "foodId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount REAL NOT NULL DEFAULT 1.00,
  measurement TEXT NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  fat INTEGER NOT NULL DEFAULT 0,
  carbs INTEGER NOT NULL DEFAULT 0,
  protein INTEGER NOT NULL DEFAULT 0,
  popularity INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT food_measurement_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX food_measurement_foodid_index ON "foodMeasurement" ("foodId" ASC);

CREATE INDEX food_measurement_userid_index ON "foodMeasurement" ("userId" ASC);

CREATE TABLE token (
  id TEXT NOT NULL,
  "tokenDigest" TEXT NOT NULL,
  type TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "userAccountId" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires INTEGER NOT NULL,
  CONSTRAINT token_pkey PRIMARY KEY (id ASC)
);

CREATE UNIQUE INDEX token_tokendigest_unique ON token ("tokenDigest" ASC);

CREATE INDEX token_type_index ON token (type ASC);

CREATE INDEX token_clientid_index ON token ("clientId" ASC);

CREATE INDEX token_useraccountid_index ON token ("userAccountId" ASC);

CREATE TABLE upload (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "publicId" TEXT NOT NULL,
  "entityType" TEXT NULL,
  "entityId" TEXT NULL,
  extension TEXT NULL,
  CONSTRAINT upload_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX upload_userid_index ON upload ("userId" ASC);

CREATE INDEX upload_publicid_index ON upload ("publicId" ASC);

CREATE UNIQUE INDEX upload_publicid_unique on upload ("publicId" ASC);

CREATE TABLE "user" (
  id TEXT NOT NULL,
  "preferredName" VARCHAR(255) NULL,
  "legacyPreferences" VARCHAR(255) NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "role" VARCHAR(255) NULL,
  CONSTRAINT user_pkey PRIMARY KEY (id ASC)
);

CREATE TABLE "userAccount" (
  id TEXT NOT NULL,
  verified INTEGER NULL DEFAULT 0,
  "userId" TEXT NOT NULL,
  source TEXT NOT NULL,
  "sourceIdentifier" TEXT NULL,
  "passwordHash" TEXT NULL,
  "tokenDigest" TEXT NULL,
  "rememberTokenDigest" TEXT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_account_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX user_account_verified_index ON "userAccount" (verified ASC);

CREATE INDEX user_account_source_index ON "userAccount" (source ASC);

CREATE INDEX user_account_sourceidentifier_index ON "userAccount" ("sourceIdentifier" ASC);

CREATE INDEX user_account_passwordhash_index ON "userAccount" ("passwordHash" ASC);

CREATE INDEX user_account_tokendigest_index ON "userAccount" ("tokenDigest" ASC);

CREATE INDEX user_account_remembertokendigest_index ON "userAccount" ("rememberTokenDigest" ASC);

CREATE UNIQUE INDEX user_account_source_sourceidentifier_unique ON "userAccount" (source ASC, "sourceIdentifier" ASC);

CREATE TABLE "userPreference" (
  id TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  preference TEXT NOT NULL,
  value TEXT NOT NULL,
  CONSTRAINT user_preference_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX user_preference_userid_index ON "userPreference" ("userId" ASC);

CREATE INDEX user_preference_preference_index ON "userPreference" (preference ASC);

CREATE UNIQUE INDEX user_preference_userid_preference_unique ON "userPreference" ("userId" ASC, preference ASC);

CREATE TABLE "weightLog" (
  id TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  day TEXT NOT NULL,
  weight INTEGER NOT NULL,
  CONSTRAINT weight_log_pkey PRIMARY KEY (id ASC)
);

CREATE INDEX weight_log_userid_index ON "weightLog" ("userId" ASC);

CREATE INDEX weight_log_day_index ON "weightLog" (day ASC);
