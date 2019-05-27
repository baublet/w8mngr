DROP TABLE IF EXISTS "weight_entries";

CREATE SEQUENCE IF NOT EXISTS weight_entries_id_seq;

CREATE TABLE "weight_entries" (
    "id" int4 NOT NULL DEFAULT nextval('weight_entries_id_seq'::regclass),
    "value" int4,
    "day" int4,
    "user_id" int4,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "day_ts" timestamp NOT NULL DEFAULT '2016-06-08 16:11:25.4741'::timestamp without time zone,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "users";

CREATE SEQUENCE IF NOT EXISTS users_id_seq;

CREATE TABLE "users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "email" varchar,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "password_digest" varchar,
    "remember_digest" varchar,
    "reset_digest" varchar,
    "reset_sent_at" timestamp,
    "role" int4 DEFAULT 0,
    "preferences" hstore NOT NULL DEFAULT '"sex"=>"na"'::hstore,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "tags";CREATE SEQUENCE IF NOT EXISTS tags_id_seq;
CREATE TABLE "tags" (
    "id" int4 NOT NULL DEFAULT nextval('tags_id_seq'::regclass),
    "name" varchar,
    "taggings_count" int4 DEFAULT 0,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "taggings";CREATE SEQUENCE IF NOT EXISTS taggings_id_seq;
CREATE TABLE "taggings" (
    "id" int4 NOT NULL DEFAULT nextval('taggings_id_seq'::regclass),
    "tag_id" int4,
    "taggable_id" int4,
    "taggable_type" varchar,
    "tagger_id" int4,
    "tagger_type" varchar,
    "context" varchar(128),
    "created_at" timestamp,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "schema_migrations";CREATE TABLE "schema_migrations" (
    "version" varchar NOT NULL
);

DROP TABLE IF EXISTS "routines";CREATE SEQUENCE IF NOT EXISTS routines_id_seq;
CREATE TABLE "routines" (
    "id" int4 NOT NULL DEFAULT nextval('routines_id_seq'::regclass),
    "user_id" int4,
    "name" text,
    "description" text,
    "last_completion" int8,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "activities" _int4 DEFAULT '{}'::integer[],
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "recipes";CREATE SEQUENCE IF NOT EXISTS recipes_id_seq;
CREATE TABLE "recipes" (
    "id" int4 NOT NULL DEFAULT nextval('recipes_id_seq'::regclass),
    "name" text NOT NULL,
    "description" text,
    "instructions" text,
    "user_id" int4,
    "popularity" int4 DEFAULT 0,
    "likes" int4 DEFAULT 0,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "servings" int4 DEFAULT 1,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "pt_messages";CREATE SEQUENCE IF NOT EXISTS pt_messages_id_seq;
CREATE TABLE "pt_messages" (
    "id" int4 NOT NULL DEFAULT nextval('pt_messages_id_seq'::regclass),
    "user_id" int4,
    "message_type" int2 NOT NULL,
    "uid" varchar(32) NOT NULL,
    "message" text NOT NULL,
    "seen" bool DEFAULT false,
    "deleted" bool DEFAULT false,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "mood" int2 DEFAULT 0,
    "message_html" text,
    "subject" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "measurements";CREATE SEQUENCE IF NOT EXISTS measurements_id_seq;
CREATE TABLE "measurements" (
    "id" int4 NOT NULL DEFAULT nextval('measurements_id_seq'::regclass),
    "amount" text NOT NULL,
    "unit" text NOT NULL,
    "calories" int4 NOT NULL,
    "fat" int4 NOT NULL,
    "carbs" int4 NOT NULL,
    "protein" int4 NOT NULL,
    "popularity" int4 DEFAULT 0,
    "food_id" int4,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "ingredients";CREATE SEQUENCE IF NOT EXISTS ingredients_id_seq;
CREATE TABLE "ingredients" (
    "id" int4 NOT NULL DEFAULT nextval('ingredients_id_seq'::regclass),
    "recipe_id" int4,
    "measurement_id" int4,
    "name" text,
    "calories" int4,
    "fat" int4,
    "carbs" int4,
    "protein" int4,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "amount" varchar,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "foods";CREATE SEQUENCE IF NOT EXISTS foods_id_seq;
CREATE TABLE "foods" (
    "id" int4 NOT NULL DEFAULT nextval('foods_id_seq'::regclass),
    "name" text NOT NULL,
    "description" text,
    "ndbno" text,
    "upc" text,
    "popularity" int4 DEFAULT 0,
    "likes" int4 DEFAULT 0,
    "user_id" int4,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "deleted" bool DEFAULT false,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "food_entries";CREATE SEQUENCE IF NOT EXISTS food_entries_id_seq;
CREATE TABLE "food_entries" (
    "id" int4 NOT NULL DEFAULT nextval('food_entries_id_seq'::regclass),
    "description" text NOT NULL,
    "calories" int8 NOT NULL DEFAULT 0,
    "fat" int4,
    "carbs" int4,
    "protein" int4,
    "day" int4 NOT NULL,
    "user_id" int4,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "day_ts" timestamp NOT NULL DEFAULT '2016-06-08 16:11:25.25216'::timestamp without time zone,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "activity_entries";CREATE SEQUENCE IF NOT EXISTS activity_entries_id_seq;
CREATE TABLE "activity_entries" (
    "id" int4 NOT NULL DEFAULT nextval('activity_entries_id_seq'::regclass),
    "activity_id" int4,
    "user_id" int4,
    "routine_id" int4,
    "day" int8,
    "reps" int4,
    "work" int4,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "day_ts" timestamp NOT NULL DEFAULT '2016-07-15 12:45:17.577479'::timestamp without time zone,
    "calories" numeric(15,2) DEFAULT 0,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "activities";CREATE SEQUENCE IF NOT EXISTS activities_id_seq;
CREATE TABLE "activities" (
    "id" int4 NOT NULL DEFAULT nextval('activities_id_seq'::regclass),
    "user_id" int4,
    "name" text,
    "description" text,
    "exrx" text,
    "activity_type" int2 NOT NULL DEFAULT 0,
    "muscle_groups" varchar(24) NOT NULL DEFAULT '000000000000000000000000'::character varying,
    "calories_formula" int2,
    "popularity" int4,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "deleted" bool NOT NULL DEFAULT false,
    "intensity" int2 DEFAULT 0,
    PRIMARY KEY ("id")
);

