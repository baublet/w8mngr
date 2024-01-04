import addDays from "date-fns/addDays/index.js";
import subYears from "date-fns/subYears/index.js";
import clamp from "lodash.clamp";

import { Context } from "../createContext.js";
import {
  Activity,
  activityDataService,
} from "../dataServices/activity/index.js";
import {
  ActivityLog,
  activityLogDataService,
} from "../dataServices/activityLog/index.js";
import { foodDataService } from "../dataServices/food/index.js";
import { foodLogDataService } from "../dataServices/foodLog/index.js";
import { foodMeasurementDataService } from "../dataServices/foodMeasurement/index.js";
import {
  UserAccountEntity,
  userAccountDataService,
} from "../dataServices/userAccount/index.js";
import { UserEntity, userDataService } from "../dataServices/user/index.js";
import { weightLogDataService } from "../dataServices/weightLog/index.js";
import { dayStringFromDate } from "../../shared/dayStringFromDate.js";

export async function seedData({
  yearsBack = 1,
  usersToCreate = 1,
  context,
}: {
  yearsBack?: number;
  usersToCreate?: number;
  context: Context;
}) {
  const minDate = subYears(new Date(), yearsBack);
  const maxDate = new Date();
  const maxDay = dayStringFromDate(maxDate);

  const allDaySet: Set<string> = new Set();
  let subjectDate = minDate;
  let totalMaxDays = 5000; // Safety valve
  while (!allDaySet.has(maxDay) && totalMaxDays--) {
    allDaySet.add(dayStringFromDate(subjectDate));
    subjectDate = addDays(subjectDate, 1);
  }
  const allDays: string[] = Array.from(allDaySet);

  const userActivities: Record<
    string,
    Pick<Activity, "id" | "type" | "userId" | "name" | "description">[]
  > = {};
  const userAccounts: Record<string, UserAccountEntity> = {};

  await seedUsers();
  await seedWeightEntries();
  await seedActivities();
  await saveActivityEntries();
  await seedFoods();
  await seedFoodEntries();

  const users: UserEntity[] = [];

  async function seedUsers() {
    for (let i = 0; i < usersToCreate; i++) {
      const user = await userDataService.register(context, {
        email: randomWord() + "@" + randomWord() + ".com",
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
  }

  async function seedActivities() {
    const activityTypes: Activity["type"][] = [
      "DISTANCE",
      "REPETITIVE",
      "TIMED",
      "WEIGHT",
    ];

    for (const user of users) {
      const userActivitiesCount = randomNumberBetween(3, 5);
      userActivities[user.id] = [];
      for (let i = 0; i < userActivitiesCount; i++) {
        const activities = await activityDataService.create(context, [
          {
            userId: user.id,
            name: `${randomWord()} ${randomWord()}`,
            description: paragraphs(randomNumberBetween(1, 3)),
            type: activityTypes[randomNumberBetween(0, 3)],
          },
        ]);
        userActivities[user.id].push(...activities);
      }
    }
  }

  async function saveActivityEntries() {
    let total = 0;

    function randomRepsAndWork(type: Activity["type"]): {
      reps: number;
      work: number;
    } {
      switch (type) {
        case "DISTANCE":
          return {
            reps: 0,
            work: randomNumberBetween(500, 10000),
          };
        case "REPETITIVE":
          return {
            reps: randomNumberBetween(1, 50),
            work: 0,
          };
        case "TIMED":
          return {
            reps: 0,
            work: randomNumberBetween(100, 50000),
          };
        case "WEIGHT":
          return {
            reps: randomNumberBetween(1, 20),
            work: randomNumberBetween(100, 2000),
          };
      }
      throw new Error("Unknown randomRepsAndWork type: " + type);
    }

    // Everyone else
    for (const [userId, activities] of Object.entries(userActivities)) {
      for (const activity of activities) {
        const activityEntries: Partial<ActivityLog>[] = [];
        const userActivityEntriesCount = randomNumberBetween(30, 200);
        for (let i = 0; i < userActivityEntriesCount; i++) {
          total++;
          activityEntries.push({
            activityId: activity.id,
            day: dayStringFromDate(randomDateBetween(minDate, maxDate)),
            userId,
            ...randomRepsAndWork(activity.type),
          });
        }
        await activityLogDataService.upsert(context, activityEntries);
      }
    }
  }

  async function seedFoods() {
    for (const user of users) {
      const userFoodsCount = randomNumberBetween(0, 200);
      for (let i = 0; i < userFoodsCount; i++) {
        const foods = await foodDataService.create(context, [
          {
            userId: user.id,
            name: `${randomWord()} ${randomWord()}`,
            description: paragraphs(randomNumberBetween(1, 3)),
          },
        ]);
        const food = foods[0];
        const foodMeasurements = randomNumberBetween(0, 3);
        for (let j = 0; j < foodMeasurements; j++) {
          await foodMeasurementDataService.create(context, [
            {
              foodId: food.id,
              userId: user.id,
              amount: randomNumberBetween(1, 0, 2),
              measurement: randomWord(),
              calories: randomNumberBetween(1, 500),
              fat: randomNumberBetween(1, 50),
              carbs: randomNumberBetween(1, 50),
              protein: randomNumberBetween(1, 50),
            },
          ]);
        }
      }
    }
  }

  async function seedFoodEntries() {
    for (const user of users) {
      const userTargetCalories = randomNumberBetween(1200, 2500);
      for (const day of allDays) {
        const skip = randomNumberBetween(0, 12);
        if (skip === 0) {
          continue;
        }

        const calories = randomNumberBetween(
          userTargetCalories - 500,
          userTargetCalories + 500
        );
        const fat = randomNumberBetween(30, 100);
        const carbs = randomNumberBetween(30, 200);
        const protein = randomNumberBetween(30, 150);
        await foodLogDataService.upsert(context, [
          {
            userId: user.id,
            description: `2 ${randomWord()} ${randomWord()}`,
            day,
            calories,
            fat,
            carbs,
            protein,
          },
        ]);
      }
    }
  }

  async function seedWeightEntries() {
    for (const user of users) {
      let userTargetWeightInLbs = randomNumberBetween(100, 300);
      const minWeight = userTargetWeightInLbs - 20;
      const maxWeight = userTargetWeightInLbs + 20;

      const trend = oneOf(["up", "down"]);

      for (const day of allDays) {
        const skip = randomNumberBetween(0, 3);
        if (skip === 0) {
          continue;
        }

        let weight = Math.ceil(
          randomNumberBetween(
            userTargetWeightInLbs - 3,
            userTargetWeightInLbs + 3
          ) * 453.592
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
  }

  return {
    userAccounts: Object.values(userAccounts),
  };
}

function sentence(num: number): string {
  const words: string[] = [];

  for (let i = 0; i < num; i++) {
    words.push(randomWord());
  }

  return words.join(" ") + ".";
}

function sentences(num: number): string {
  const sentences: string[] = [];

  for (let i = 0; i < num; i++) {
    sentences.push(sentence(randomNumberBetween(5, 15)));
  }

  return sentences.join(" ");
}

function paragraphs(num: number): string {
  const paragraphs: string[] = [];

  for (let i = 0; i < num; i++) {
    paragraphs.push(sentences(randomNumberBetween(3, 5)));
  }

  return paragraphs.join("\n\n");
}

function oneOf<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomWord(length = Math.floor(Math.random() * 15)): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function randomNumberBetween(min = 1, max = 10, decimalPlaces = 0) {
  const magnitudeMultiplier =
    decimalPlaces === 0 ? 1 : Math.pow(10, decimalPlaces);
  const random = Math.floor(
    Math.random() * magnitudeMultiplier * (max - min + 1) + min
  );
  return Number((random / magnitudeMultiplier).toFixed(decimalPlaces));
}

function randomDateBetween(min: Date, max: Date): Date {
  return new Date(randomNumberBetween(min.getTime(), max.getTime()));
}
