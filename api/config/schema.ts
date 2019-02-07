import { gql } from "apollo-server-lambda";

export default gql`
  type Query {
    hello: String
    user: User
    foodEntries(day: Int): [FoodEntry]!
  }
  type Mutation {
    register(email: String, password: String): AuthPayload
    login(email: string, login: string): AuthPayload
    addFoodEntry(
      day: Int
      description: String
      calories: Int
      fat: Int
      carbs: Int
      protein: Int
    ): FoodEntry!
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
`;
