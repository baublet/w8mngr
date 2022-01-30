import { getQueryBuilderFactory } from "../../config";
import { UserAccountEntity } from "./types";

export const getQuery =
  getQueryBuilderFactory<UserAccountEntity>("user_account");
