import knex from "knex";
import fs from "fs";
import path from "path";
import { ulid } from "ulid";
import { exec } from "child_process";

import type { FoodEntity, FoodMeasurement } from "../api/dataServices";

import config from "../knexfile";

const database = process.env.DATABASE || "develop";
const db = knex((config as any)[database]);
const getDb = () => db;
const legacyFoodIdToFoodId: Record<number, string> = {};

const adminUserId = "01FPDV213V6K6M04D4YMR8T3QH";

(async () => {
  await seedAdmin();
  await seedFoods();
  await seedMeasurements();
  console.log("Done");
  process.exit(0);
})();

async function seedAdmin() {
  console.log("Seeding admin");
  const db = getDb();

  await db.table("user").insert({
    id: adminUserId,
    preferredName: "Ryan",
  });

  await db.table("user_account").insert({
    id: ulid(),
    passwordHash:
      "$2b$10$z7qgrav/kYXlSdVKdgIe3.HXz9gkfD6WmqpMMp8UnQQtJ0SM1yc1q",
    source: "local",
    sourceIdentifier: "test",
    userId: adminUserId,
  });
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
    user_id: string;
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
      const db = getDb();
      const legacyFoods = await db
        .select<LegacyFood[]>("*")
        .from("legacy_foods")
        .limit(batchSize + 1)
        .offset(offset);

      offset += batchSize;
      totalFoods += legacyFoods.length - 1;

      if (legacyFoods.length <= batchSize) {
        hasMoreFoods = false;
      }

      await db.batchInsert<FoodEntity>(
        "food",
        legacyFoods.slice(0, -1).map((legacyFood) => {
          const newId = ulid();
          legacyFoodIdToFoodId[legacyFood.id] = newId;

          return {
            id: newId,
            description: legacyFood.description,
            name: legacyFood.name,
            userId: adminUserId,
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

async function wait(ms: number = 1000) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
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
    const batchNumber = Math.ceil(offset / 100);
    const db = getDb();
    const newFoods = await db
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
    const measurements = await db
      .from<Legacy>("legacy_measurements")
      .select("*")
      .whereIn(
        "food_id",
        newFoods.map((f) => f.legacyId || -1)
      );
    total += measurements.length;
    measurementsToAdd.push(
      ...measurements.map((measurement) => ({
        id: ulid(),
        amount: parseFloat(measurement.amount),
        measurement: measurement.unit,
        calories: measurement.calories,
        fat: measurement.fat,
        carbs: measurement.carbs,
        protein: measurement.protein,
        userId: adminUserId,
        foodId: legacyFoodIdToFoodId[measurement.food_id as number],
      }))
    );
    await db.batchInsert<FoodMeasurement>(
      "food_measurement",
      measurementsToAdd,
      100
    );
  }

  console.log("\nTotal measurements: ", total);
}
