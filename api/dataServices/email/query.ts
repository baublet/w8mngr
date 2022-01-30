import { getQueryBuilderFactory } from "../../config";
import { EmailEntity } from "./types";

export const getQuery = getQueryBuilderFactory<EmailEntity>("email");
