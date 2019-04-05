import { gql } from "apollo-server-lambda";

export default gql`
  type Query {
    hello: String
    user: User

    foodEntries(day: Int): [FoodEntry]!

    foods(offset: Int = 0, limit: Int = 10): [Food]!
    food(id: Int): Food
    searchFoods(term: String, limit: Int, offset: Int): [Food]!
    measurements(foodIds: [Int]): [Measurement]

    activity(id: Int): Activity
    activities(
      order_by: String = "updated_at"
      sort: String = "desc"
      offset: Int = 0
      limit: Int = 10
    ): [Activity]!
    searchActivities(
      term: String = ""
      muscle_groups: [String] = []
      order_by: String = "updated_at"
      sort: String = "DESC"
      offset: Int = 0
      limit: Int = 10
    ): [Activity]!
    activityEntries(activityId: Int, day: Int): [ActivityEntry]
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
    deleteFoodEntry(id: Int): Boolean
    createFood(name: String, description: String): Food!
    updateFood(id: Int, name: String, description: String): Food!
    deleteFood(id: Int): Boolean
    createMeasurement(
      food_id: Int
      amount: Float
      unit: String
      calories: Int
      fat: Int
      carbs: Int
      protein: Int
    ): Measurement
    updateMeasurement(
      id: Int
      food_id: Int
      amount: Float
      unit: String
      calories: Int
      fat: Int
      carbs: Int
      protein: Int
    ): Measurement
    deleteMeasurement(id: Int, food_id: Int): Boolean
    createActivity(
      name: String
      description: String
      exrx: String
      activity_type: Int
      muscle_groups: String
      intensity: Int
    ): Activity
    updateActivity(
      id: Int
      name: String
      description: String
      exrx: String
      activity_type: Int
      muscle_groups: String
      intensity: Int
    ): Activity
    deleteActivity(id: Int): Boolean

    createActivityEntry(
      activityId: Int
      day: Int
      reps: Int
      work: Int
    ): ActivityEntry
    updateActivityEntry(id: Int, reps: Int, work: Int): ActivityEntry
    deleteActivityEntry(id: Int): Boolean
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
    amount: Float
    unit: String
    calories: Int
    fat: Int
    carbs: Int
    protein: Int
    popularity: Int
    created_at: String
    updated_at: String
  }

  type Activity {
    id: Int
    name: String
    description: String
    exrx: String
    activity_type: Int
    muscle_groups: String
    intensity: Int
    popularity: Int
    created_at: String
    updated_at: String
  }

  type ActivityEntry {
    id: Int
    activity_id: Int
    day: Int
    reps: Int
    work: Int
  }
`;
