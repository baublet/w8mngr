import { getQueryBuilderFactory } from "../../config";
import { UserEntity } from "./index";

export const getQuery = getQueryBuilderFactory<UserEntity>("user");
