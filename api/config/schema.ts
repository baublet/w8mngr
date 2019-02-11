import { gql } from "apollo-server-lambda";

export default gql`
  type Query {
    hello: String
    user: User
    foodEntries(day: Int): [FoodEntry]!
    searchFoods(term: String, limit: Int, offset: Int): [FoodEntry]!
  }

  type Mutation {
    register(email: String, password: String): AuthPayload
    login(email: String, password: String): AuthPayload
    createFoodEntry(
      day: Int
      description: String
      calories: Int
      fat: Int
      carbs: Int
      protein: Int
    ): FoodEntry!
    updateFoodEntry(
      id: Int
      description: String
      calories: Int
      fat: Int
      carbs: Int
      protein: Int
    ): FoodEntry!
    createFood(name: String, description: String): Food!
    deleteFoodEntry(id: Int): Boolean
  }

  type AuthPayload {
    user: User
    token: String
  }

  type User {
    id: Int
    email: String
    created_at: String
    updated_at: String
    role: String
    preferences: UserPreferences
  }

  type UserPreferences {
    sex: String
    name: String
    units: String
    alerts: UserPreferencesAlerts
    height: Int
    birthday: String
    timezone: String
    faturday_fat: Int
    faturday_carbs: Int
    faturday_protein: Int
    faturday_calories: Int
    faturday_enabled: Boolean
    target_calories: Int
    differential_metric: Int
  }

  type UserPreferencesAlerts {
    food_log_reminder: Boolean
    food_log_reminder_hours: Int
    target_calories_reminder: Boolean
  }

  type FoodEntry {
    id: Int
    description: String
    calories: Int
    fat: Int
    carbs: Int
    protein: Int
    day: Int
    created_at: String
    updated_at: String
  }

  type Food {
    id: Int
    user_id: Int
    name: String
    description: String
    upc: String
    popularity: Int
    created_at: String
    updated_at: String
    deleted: Boolean
    measurements: [Measurement]!
  }

  type Measurement {
    id: Int
    food_id: Int
    amount: Int
    unit: String
    calories: Int
    fat: Int
    carbs: Int
    protein: Int
    popularity: Int
  }
`;
