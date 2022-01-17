import { createDataService } from "../createDataService";
import { getQuery } from "./query";
import { sendPendingEmails } from "./sendPendingEmails";
import { create } from "./create";

export const emailDataService = {
  ...createDataService(getQuery, "Email"),
  create,
  sendPendingEmails,
};

export { EmailEntity } from "./types";
