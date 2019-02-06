import { query } from "../api/config/db";

export const clearDatabase = () => {
  return new Promise(async resolve => {
    await query({
      text:
        "TRUNCATE activities, activity_entries, food_entries, foods, ingredients, measurements, pt_messages, recipes, routines, taggings, tags, users, weight_entries RESTART IDENTITY;"
    });
    resolve();
  });
};
