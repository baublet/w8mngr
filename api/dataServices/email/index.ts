import { create } from "./create.js";
import { rootService } from "./rootService.js";
import { sendPendingEmails } from "./sendPendingEmails.js";

export const emailDataService = {
  ...rootService,
  create,
  sendPendingEmails,
};

export type { EmailEntity } from "./types.js";
