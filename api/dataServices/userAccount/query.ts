import { getQueryBuilderFactory } from "../../config/db";
import { UserAccountEntity } from "./types";

export const getQuery =
  getQueryBuilderFactory<UserAccountEntity>("user_account");
