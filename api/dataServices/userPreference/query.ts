import { getQueryBuilderFactory } from "../../config/db";
import { UserPreferenceEntity } from "./types";

export const getQuery = getQueryBuilderFactory<UserPreferenceEntity>("user_preference");
