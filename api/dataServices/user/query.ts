import { getQueryBuilderFactory } from "../../config/db";
import { UserEntity } from "./types";

export const getQuery = getQueryBuilderFactory<UserEntity>("user");
