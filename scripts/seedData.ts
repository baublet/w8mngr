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

const adminUserId = "01FPDV213V6K6M04D4YMR8T3QH";

(async () => {
  await seedAdmin();
  await seedFoods();
  await seedMeasurements();
})();

async function seedAdmin() {
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
  console.log("Seeding legacy foods into the new foods table...");
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
  const batchSize = 100;
  let totalFoods = 0;

  while (hasMoreFoods) {
    try {
      const batchNumber = Math.ceil(offset / 100);
      console.log("Batch " + batchNumber + " processing...");
      const db = getDb();
      const legacyFoods = await db
        .select<LegacyFood[]>("*")
        .from("legacy_foods")
        .where("deleted", "=", false)
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

          return {
            id: newId,
            description: legacyFood.description,
            name: legacyFood.name,
            userId: adminUserId,
          };
        })
      );
    } catch (e) {
      throw e;
    }
  }

  console.log("Total foods: ", totalFoods);
}

async function wait(ms: number = 1000) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function seedMeasurements(): Promise<void> {
  console.log("Seeding legacy measurements into the new measurements table...");
  type Legacy = {
    id: number;
    name: string;
    food_id: string;
    amount: string;
    unit: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  };
  let hasMore = true;
  let offset = 0;
  const batchSize = 100;
  let total = 0;
  while (hasMore) {
    const batchNumber = Math.ceil(offset / 100);
    console.log("Batch " + batchNumber + " processing...");
    const db = getDb();
    const newFoods = await db
      .select<FoodEntity[]>("*")
      .from("food")
      .where("legacyId", "<>", null)
      .limit(batchSize + 1)
      .offset(offset);

    offset += batchSize;
    total += newFoods.length - 1;

    if (newFoods.length <= batchSize) {
      hasMore = false;
    }

    for (const food of newFoods) {
      console.log(food.name);
      const db = getDb();
      const measurements = await db
        .from<Legacy>("legacy_measurements")
        .select("*")
        .where("food_id", "=", food.legacyId || -1);
      await db.batchInsert<FoodMeasurement>(
        "measurement",
        measurements.map((measurement) => ({
          id: ulid(),
          amount: parseFloat(measurement.amount),
          measure: measurement.unit,
          calories: measurement.calories,
          fat: measurement.fat,
          carbs: measurement.carbs,
          protein: measurement.protein,
          foodId: food.id,
        }))
      );
    }
  }

  console.log("Total measurements: ", total);
}
