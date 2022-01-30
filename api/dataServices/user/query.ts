import { getQueryBuilderFactory } from "../../config";
import { UserEntity } from "./types";

export const getQuery = getQueryBuilderFactory<UserEntity>("user");
