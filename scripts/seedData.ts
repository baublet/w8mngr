import { createServiceContainer } from "@baublet/service-container";
import "minifaker/locales/en";

import addDays from "date-fns/addDays";
import subYears from "date-fns/subYears";
import { arrayElement, date, email, number, word } from "minifaker";
import clamp from "lodash.clamp";

import { config } from "../api/config/config";
import { dbService } from "../api/config/db";
import { createContext } from "../api/createContext";
import { Activity, activityDataService } from "../api/dataServices/activity";
import {
  ActivityLog,
  activityLogDataService,
} from "../api/dataServices/activityLog";
import { foodDataService } from "../api/dataServices/food";
import { foodLogDataService } from "../api/dataServices/foodLog";
import { foodMeasurementDataService } from "../api/dataServices/foodMeasurement";
import {
  UserAccountEntity,
  userAccountDataService,
} from "../api/dataServices/userAccount";
import { UserEntity, userDataService } from "../api/dataServices/user";
import { weightLogDataService } from "../api/dataServices/weightLog";
import { dayStringFromDate } from "../shared";

const minDate = subYears(new Date(), 1);
const minDay = dayStringFromDate(minDate);
const maxDate = new Date();
const maxDay = dayStringFromDate(maxDate);

const allDaySet: Set<string> = new Set();
let subjectDate = minDate;
console.log("Materializing date range");
while (!allDaySet.has(maxDay)) {
  allDaySet.add(dayStringFromDate(subjectDate));
  subjectDate = addDays(subjectDate, 1);
}
const allDays: string[] = Array.from(allDaySet);
console.log("Finished materializing date range: ");

const options = {
  usersToCreate: 3,
} as const;

const userActivities: Record<
  string,
  Pick<Activity, "id" | "type" | "userId" | "name" | "description">[]
> = {};
const userAccounts: Record<string, UserAccountEntity> = {};

const context = createContext({
  clientId: "upsertRecordsToAlgolia",
});

function sentence(num: number): string {
  const words: string[] = [];

  for (let i = 0; i < num; i++) {
    words.push(word());
  }

  return words.join(" ") + ".";
}

function sentences(num: number): string {
  const sentences: string[] = [];

  for (let i = 0; i < num; i++) {
    sentences.push(sentence(number({ min: 5, max: 15 })));
  }

  return sentences.join(" ");
}

function paragraphs(num: number): string {
  const paragraphs: string[] = [];

  for (let i = 0; i < num; i++) {
    paragraphs.push(sentences(number({ min: 3, max: 5 })));
  }

  return paragraphs.join("\n\n");
}

(async () => {
  console.log("Initializing and testing database connections");

  const serviceContainer = createServiceContainer();

  const database = config.get("DATABASE");
  const dbInstance = serviceContainer.get(dbService);
  const getNewDb = () => dbInstance("W8MNGR_1");

  await getNewDb().selectFrom("user").selectAll().limit(1).executeTakeFirst();

  console.log(
    "Databases working! Connections: ",
    JSON.stringify({
      newDatabase: database,
    })
  );
})().then(async () => {
  await seedUsers();
  await seedWeightEntries();
  await seedActivities();
  await saveActivityEntries();
  await seedFoods();
  await seedFoodEntries();

  const db = await context.services.get(dbService);
  console.log("Done");
  process.exit(0);
});

const users: UserEntity[] = [];
const getAdminUser = () => {
  const admin = users.find((u) => u.role === "admin");
  if (!admin) {
    throw new Error("No admin found!");
  }
  return admin;
};

async function seedUsers() {
  console.log("Seeding users");
  let total = 1;

  const admin = await userDataService.register(context, {
    email: "admin@w8mngr.com",
    password: "test",
    passwordConfirmation: "test",
    role: "admin",
  });

  if (admin instanceof Error) {
    console.error("Error: ", admin.message, admin.stack);
    throw new Error("Error creating admin user");
  }

  users.push(admin.user);

  for (let i = 0; i < options.usersToCreate; i++) {
    total++;
    process.stdout.write(".");
    const user = await userDataService.register(context, {
      email: email(),
      password: "test",
      passwordConfirmation: "test",
    });
    if (user instanceof Error) {
      throw new Error("Error creating admin user");
    }
    users.push(user.user);

    const userAccount = await userAccountDataService.findOneOrFailBy(
      context,
      (q) => q.where("userId", "=", user.user.id)
    );
    userAccounts[user.user.id] = userAccount;
  }

  console.log("\nTotal users: ", total);
}

async function seedActivities() {
  console.log("Seeding activities");
  let total = 0;

  const activityTypes: Activity["type"][] = [
    "DISTANCE",
    "REPETITIVE",
    "TIMED",
    "WEIGHT",
  ];

  for (const user of users) {
    const userActivitiesCount = number({ min: 3, max: 5 });
    userActivities[user.id] = [];
    for (let i = 0; i < userActivitiesCount; i++) {
      total++;
      process.stdout.write(".");
      const activities = await activityDataService.create(context, [
        {
          userId: user.id,
          name: `${word()} ${word()}`,
          description: paragraphs(number({ min: 1, max: 3 })),
          type: activityTypes[number({ min: 0, max: 3 })],
        },
      ]);
      userActivities[user.id].push(...activities);
    }
  }

  console.log("\nSeeded activities: ", total);
}

async function saveActivityEntries() {
  console.log("Seeding activity entries");
  let total = 0;

  function randomRepsAndWork(type: Activity["type"]): {
    reps: number;
    work: number;
  } {
    switch (type) {
      case "DISTANCE":
        return {
          reps: 0,
          work: number({ min: 500, max: 10000 }),
        };
      case "REPETITIVE":
        return {
          reps: number({ min: 1, max: 50 }),
          work: 0,
        };
      case "TIMED":
        return {
          reps: 0,
          work: number({ min: 100, max: 50000 }),
        };
      case "WEIGHT":
        return {
          reps: number({ min: 1, max: 20 }),
          work: number({ min: 100, max: 2000 }),
        };
    }
    throw new Error("Unknown randomRepsAndWork type: " + type);
  }

  // Everyone else
  for (const [userId, activities] of Object.entries(userActivities)) {
    process.stdout.write("\n");
    for (const activity of activities) {
      process.stdout.write(".");
      const activityEntries: Partial<ActivityLog>[] = [];
      const userActivityEntriesCount = number({ min: 30, max: 200 });
      for (let i = 0; i < userActivityEntriesCount; i++) {
        total++;
        activityEntries.push({
          activityId: activity.id,
          day: dayStringFromDate(
            date({
              from: minDate,
              to: maxDate,
            })
          ),
          userId,
          ...randomRepsAndWork(activity.type),
        });
      }
      await activityLogDataService.upsert(context, activityEntries);
    }
  }

  console.log("\nSeeded activity entries: ", total);
}

async function seedFoods() {
  console.log("Seeding foods");
  let total = 0;

  for (const user of users) {
    process.stdout.write("\n");
    const userFoodsCount = number({ min: 0, max: 200 });
    for (let i = 0; i < userFoodsCount; i++) {
      total++;
      process.stdout.write(".");
      const foods = await foodDataService.create(context, [
        {
          userId: user.id,
          name: `${word()} ${word()}`,
          description: paragraphs(number({ min: 1, max: 3 })),
        },
      ]);
      const food = foods[0];
      const foodMeasurements = number({ min: 0, max: 3 });
      for (let j = 0; j < foodMeasurements; j++) {
        await foodMeasurementDataService.create(context, [
          {
            foodId: food.id,
            userId: user.id,
            amount: number({ min: 1, max: 10, float: true }),
            measurement: word(),
            calories: number({ min: 1, max: 500 }),
            fat: number({ min: 1, max: 50 }),
            carbs: number({ min: 1, max: 50 }),
            protein: number({ min: 1, max: 50 }),
          },
        ]);
      }
    }
  }

  console.log("\nSeeded foods: ", total);
}

async function seedFoodEntries() {
  console.log("Seeding user foodLogs");
  let total = 0;

  for (const user of users) {
    const userTargetCalories = number({ min: 1200, max: 2500 });
    process.stdout.write("\n");
    for (const day of allDays) {
      const skip = number({ min: 0, max: 12 });
      if (skip === 0) {
        continue;
      }

      total++;
      process.stdout.write(".");

      const calories = number({
        min: userTargetCalories - 500,
        max: userTargetCalories + 500,
      });
      const fat = number({ min: 30, max: 100 });
      const carbs = number({ min: 30, max: 200 });
      const protein = number({ min: 30, max: 150 });
      await foodLogDataService.upsert(context, [
        {
          userId: user.id,
          description: `2 ${word()} ${word()}`,
          day,
          calories,
          fat,
          carbs,
          protein,
        },
      ]);
    }
  }

  console.log("\nSeeded foodsLogs: ", total);
}

async function seedWeightEntries() {
  console.log("Seeding user weight logs");
  let total = 0;

  for (const user of users) {
    let userTargetWeightInLbs = number({ min: 100, max: 300 });
    const minWeight = userTargetWeightInLbs - 20;
    const maxWeight = userTargetWeightInLbs + 20;
    process.stdout.write("\n");

    const trend = arrayElement(["up", "down"]);

    for (const day of allDays) {
      const skip = number({ min: 0, max: 3 });
      if (skip === 0) {
        continue;
      }

      total++;
      process.stdout.write(".");

      let weight = Math.ceil(
        number({
          min: userTargetWeightInLbs - 3,
          max: userTargetWeightInLbs + 3,
        }) * 453.592
      );

      if (trend === "down") {
        weight = Math.ceil(weight * 0.9);
        userTargetWeightInLbs = clamp(
          Math.ceil(userTargetWeightInLbs * 0.9),
          minWeight,
          maxWeight
        );
      }

      if (trend === "up") {
        weight = Math.ceil(weight * 1.1);
        userTargetWeightInLbs = clamp(
          Math.ceil(userTargetWeightInLbs * 1.1),
          minWeight,
          maxWeight
        );
      }

      await weightLogDataService.upsert(context, [
        {
          userId: user.id,
          day,
          weight,
        },
      ]);
    }
  }

  console.log("\nSeeded weight logs: ", total);
}
