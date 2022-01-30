import { getQueryBuilderFactory } from "../../config/db";
import { EmailEntity } from "./types";

export const getQuery = getQueryBuilderFactory<EmailEntity>("email");
