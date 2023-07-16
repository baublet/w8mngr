import { create } from "./create";
import { rootService } from "./rootService";
import { sendPendingEmails } from "./sendPendingEmails";

export const emailDataService = {
  ...rootService,
  create,
  sendPendingEmails,
};

export type { EmailEntity } from "./types";
