import knex from "knex";
import { ulid } from "ulid";

import type {
  FoodEntity,
  FoodMeasurement,
  Activity,
  ActivityMuscle,
  ActivityLog,
  FoodLogEntity,
  UserEntity,
  UserAccountEntity,
} from "../api/dataServices";
import { ActivityType, Muscle } from "../api/graphql-types";

import config from "../knexfile";

const database = process.env.DATABASE || "develop";
const newDb = knex((config as any)[database]);
const getNewDb = () => newDb;

const legacyDatabase: "develop" | "legacy" =
  database === "develop" ? "develop" : "legacy";
const legacyDb = knex((config as any)[legacyDatabase]);
const getLegacyDb = () => legacyDb;

const legacyUserIdsToNewUserIds: Record<number, string> = {};

const legacyFoodIdToFoodId: Record<number, string> = {};
const legacyActivityIdToActivityId: Record<number, string> = {};

const adminUserId = ulid();

const LEGACY_TABLES_MAP = {
  legacy: {
    activities: "activities",
    activityLog: "activity_entries",
    foodLog: "food_entries",
    foods: "foods",
    foodMeasurements: "measurements",
    users: "users",
    userAccounts: "user_accounts",
  },
  develop: {
    activities: "legacy_activities",
    activityLog: "legacy_activity_entries",
    foods: "legacy_foods",
    foodLog: "legacy_food_entries",
    foodMeasurements: "legacy_measurements",
    users: "legacy_users",
    userAccounts: "legacy_user_accounts",
  },
} as const;

(async () => {
  console.log("Initializing and testing database connections");

  await getNewDb().raw("SELECT 1");
  await getLegacyDb().raw("SELECT 1");

  console.log(
    "Databases working! Connections: ",
    JSON.stringify({
      newDatabase: database,
      legacyDatabase,
    })
  );
})().then(async () => {
  // await seedAdmin();
  await seedUsers();
  await seedActivities();
  await saveActivityEntries();
  await seedFoods();
  await seedMeasurements();
  await seedFoodEntries();
  console.log("Done");
  process.exit(0);
});

async function seedUsers(): Promise<void> {
  console.log("Seeding legacy users into the new users table");

  type LegacyUser = {
    id: number;
    email: string;
    created_at: Date;
    updated_at: Date;
    role: string;
    preferences: string;
  };

  const batchSize = 500;
  let offset = 0;
  let total = 0;

  let hasMoreUsers = true;
  do {
    process.stdout.write(".");
    const legacyEntries = await getLegacyDb()
      .select<LegacyUser[]>("*")
      .from("users")
      .limit(batchSize + 1)
      .offset(offset);

    offset += batchSize;
    total += legacyEntries.length - 1;
    if (legacyEntries.length <= batchSize) {
      hasMoreUsers = false;
    }

    await getNewDb().batchInsert(
      "user",
      legacyEntries.map((entry) => {
        const userId = ulid();
        legacyUserIdsToNewUserIds[entry.id] = userId;
        return {
          id: userId,
          createdAt: entry.created_at,
          preferredName: entry.email,
        } as UserEntity;
      })
    );

    await getNewDb().batchInsert(
      "user_account",
      legacyEntries.map((entry) => {
        const accountId = ulid();
        const userId = legacyUserIdsToNewUserIds[entry.id];
        return {
          id: accountId,
          createdAt: entry.created_at,
          source: "local",
          sourceIdentifier: entry.email,
          updatedAt: entry.updated_at,
          userId,
          verified: false,
        } as UserAccountEntity;
      })
    );
  } while (hasMoreUsers);

  console.log("\nTotal users: ", total);
}

async function seedActivities(): Promise<void> {
  console.log("Seeding legacy activities into the new activities table");
  type LegacyActivity = {
    id: number;
    name: string;
    user_id: number;
    description: string;
    exrx: string;
    activity_type: number;
    muscle_groups: string;
    intensity: number;
  };
  let hasMore = true;
  let offset = 0;
  const batchSize = 50;
  let total = 0;

  function legacyTypeToNewType(legacyType: number): ActivityType {
    switch (legacyType) {
      case 0:
        return "WEIGHT";
      case 1:
        return "TIMED";
      case 2:
        return "DISTANCE";
      case 3:
        return "REPETITIVE";
    }
    return "WEIGHT";
  }

  function slotToMuscleOrUndefined(
    groups: string,
    slot: number
  ): Muscle | undefined {
    if (groups[slot] === "0") {
      return undefined;
    }
    switch (slot) {
      case 0:
        return "BICEPS";
      case 1:
        return "DELTOIDS";
      case 2:
        return "FOREARMS";
      case 3:
        return "TRICEPS";
      case 4:
        return "TRAPEZIUS";
      case 5:
        return "LATS";
      case 6:
        return "ABS";
      case 7:
        return "OBLIQUES";
      case 8:
        return "PECTORALS";
      case 9:
        return "ADDUCTORS";
      case 10:
        return "CALVES";
      case 11:
        return "HAMSTRINGS";
      case 12:
        return "GLUTES";
      case 13:
        return "QUADS";
    }

    return undefined;
  }

  function getMuscleGroupEntities(
    activityId: string,
    muscleGroups: string
  ): ActivityMuscle[] {
    const muscles: ActivityMuscle[] = [];
    for (let i = 0; i < muscleGroups.length; i++) {
      const muscle = slotToMuscleOrUndefined(muscleGroups, i);
      if (muscle) {
        muscles.push({
          id: ulid(),
          activityId,
          muscle,
        });
      }
    }
    return muscles;
  }

  while (hasMore) {
    try {
      process.stdout.write(".");
      const legacyEntries = await getLegacyDb()
        .select<LegacyActivity[]>("*")
        .from(LEGACY_TABLES_MAP[legacyDatabase].activities)
        .limit(batchSize + 1)
        .offset(offset);

      offset += batchSize;
      total += legacyEntries.length - 1;

      if (legacyEntries.length <= batchSize) {
        hasMore = false;
      }

      const muscleGroupsToInsert: ActivityMuscle[] = [];
      await getNewDb().batchInsert<Activity>(
        "activity",
        legacyEntries.slice(0, -1).map((legacyEntry) => {
          const newId = ulid();
          legacyFoodIdToFoodId[legacyEntry.id] = newId;

          muscleGroupsToInsert.push(
            ...getMuscleGroupEntities(newId, legacyEntry.muscle_groups)
          );

          legacyActivityIdToActivityId[legacyEntry.id] = newId;

          return {
            id: newId,
            description: legacyEntry.description,
            name: legacyEntry.name,
            userId: legacyUserIdsToNewUserIds[legacyEntry.user_id],
            legacyId: legacyEntry.id,
            intensity: legacyEntry.intensity,
            exrx: legacyEntry.exrx,
            type: legacyTypeToNewType(legacyEntry.activity_type),
          };
        })
      );
      await getNewDb().batchInsert<ActivityMuscle>(
        "activity_muscle",
        muscleGroupsToInsert,
        100
      );
    } catch (e) {
      throw e;
    }
  }

  console.log("\nTotal activities: ", total);
}

async function seedFoods(): Promise<void> {
  console.log("Seeding legacy foods into the new foods table");
  type LegacyFood = {
    id: number;
    name: string;
    description: string;
    ndbno: number;
    upc: string;
    popularity: number;
    likes: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    deleted: boolean;
  };
  let hasMoreFoods = true;
  let offset = 0;
  const batchSize = 500;
  let totalFoods = 0;

  while (hasMoreFoods) {
    try {
      process.stdout.write(".");
      const legacyFoods = await getLegacyDb()
        .select<LegacyFood[]>("*")
        .from(LEGACY_TABLES_MAP[legacyDatabase].foods)
        .limit(batchSize + 1)
        .offset(offset);

      offset += batchSize;
      totalFoods += legacyFoods.length - 1;

      if (legacyFoods.length <= batchSize) {
        hasMoreFoods = false;
      }

      await getNewDb().batchInsert<FoodEntity>(
        "food",
        legacyFoods.slice(0, -1).map((legacyFood) => {
          const newId = ulid();
          legacyFoodIdToFoodId[legacyFood.id] = newId;

          return {
            id: newId,
            description: legacyFood.description,
            name: legacyFood.name,
            userId: legacyUserIdsToNewUserIds[legacyFood.user_id],
            legacyId: legacyFood.id,
          };
        })
      );
    } catch (e) {
      throw e;
    }
  }

  console.log("\nTotal foods: ", totalFoods);
}

async function seedMeasurements(): Promise<void> {
  console.log("Seeding legacy measurements into the new measurements table");
  type Legacy = {
    id: number;
    name: string;
    food_id: number;
    amount: string;
    unit: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  };
  let hasMore = true;
  let offset = 0;
  const batchSize = 1000;
  let total = 0;
  while (hasMore) {
    const newFoods = await getNewDb()
      .select<FoodEntity[]>("*")
      .from("food")
      .whereNotNull("legacyId")
      .limit(batchSize + 1)
      .offset(offset);

    offset += batchSize;

    if (newFoods.length <= batchSize) {
      hasMore = false;
    }

    const measurementsToAdd: any[] = [];
    process.stdout.write(".");
    const measurements = await getLegacyDb()
      .from<Legacy>(LEGACY_TABLES_MAP[legacyDatabase].foodMeasurements)
      .select("*")
      .whereIn(
        "food_id",
        newFoods.map((f) => f.legacyId || -1)
      );
    total += measurements.length - 1;

    const legacyFoodIdUserId = newFoods.reduce((acc, newFood) => {
      const legacyId = newFood.legacyId;
      if(legacyId) {
        acc[legacyId] = newFood.userId;
      }

      return acc;
    }, <Record<number, string>>{})

    measurementsToAdd.push(
      ...measurements.map((measurement) => ({
        id: ulid(),
        amount: parseFloat(measurement.amount),
        measurement: measurement.unit,
        calories: Math.ceil(measurement.calories),
        fat: Math.ceil(measurement.fat),
        carbs: Math.ceil(measurement.carbs),
        protein: Math.ceil(measurement.protein),
        userId: legacyFoodIdUserId[measurement.food_id],
        foodId: legacyFoodIdToFoodId[measurement.food_id as number],
      }))
    );
    await getNewDb().batchInsert<FoodMeasurement>(
      "food_measurement",
      measurementsToAdd,
      500
    );
  }

  console.log("\nTotal measurements: ", total);
}

async function seedFoodEntries() {
  console.log("Seeding legacy food entries into the new food entries table");

  let hasMore = true;
  let offset = 0;
  const batchSize = 1000;
  let total = 0;

  while (hasMore) {
    const legacyEntries = await getLegacyDb()
      .select()
      .from(LEGACY_TABLES_MAP[legacyDatabase].foodLog)
      .offset(offset)
      .limit(batchSize + 1);

    process.stdout.write(".");

    if (legacyEntries.length <= batchSize) {
      hasMore = false;
    }

    offset += batchSize;
    total += legacyEntries.length - 1;

    await getNewDb().batchInsert<FoodLogEntity>(
      "food_log",
      legacyEntries.slice(0, -1).map((legacyEntry) => ({
        id: ulid(),
        userId: legacyUserIdsToNewUserIds[legacyEntry.user_id],
        day: legacyEntry.day,
        createdAt: legacyEntry.created_at,
        updatedAt: legacyEntry.updated_at,
        description: legacyEntry.description,
        calories: legacyEntry.calories,
        fat: legacyEntry.fat,
        carbs: legacyEntry.carbs,
        protein: legacyEntry.protein,
      })),
      500
    );
  }

  console.log("\nTotal food log entries: ", total);
}

async function saveActivityEntries() {
  console.log(
    "Seeding legacy activity entries into the new activity logs table"
  );

  type LegacyActivityEntry = {
    id: number;
    activity_id: number;
    user_id: number;
    day: string;
    reps: number;
    work: number;
    created_at: string;
    updated_at: string;
  };

  let hasMore = true;
  let offset = 0;
  const batchSize = 1000;
  let total = 0;

  while (hasMore) {
    process.stdout.write(".");
    const legacyActivityEntries = await getLegacyDb()
      .select<LegacyActivityEntry[]>("*")
      .from(LEGACY_TABLES_MAP[legacyDatabase].activityLog)
      .limit(batchSize + 1)
      .offset(offset);

    if (legacyActivityEntries.length <= batchSize) {
      hasMore = false;
    }

    offset += legacyActivityEntries.length - 1;
    total += legacyActivityEntries.length - 1;

    const activityEntriesToAdd: any[] = [];

    activityEntriesToAdd.push(
      ...legacyActivityEntries
        .slice(0, -1)
        .map((entry) => {
          return {
            id: ulid(),
            userId: legacyUserIdsToNewUserIds[entry.user_id],
            activityId: legacyActivityIdToActivityId[entry.activity_id],
            day: entry.day,
            work: entry.work,
            reps: entry.reps,
            createdAt: entry.created_at,
            updatedAt: entry.updated_at,
          };
        })
        .filter((entry) => Boolean(entry.activityId))
    );

    await getNewDb().batchInsert<ActivityLog>(
      "activity_log",
      activityEntriesToAdd,
      500
    );
  }
  console.log("\nTotal activity entries: ", total);
}
