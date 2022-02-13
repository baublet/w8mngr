import { ulid } from "ulid";

import { createContext } from "./createContext";
import { emailDataService } from "./dataServices";

export const cronSchedule = "* * * * *";

export const handler = async () => {
  const context = await createContext({
    clientId: `hourly-worker-${ulid()}`,
  });

  await emailDataService.sendPendingEmails(context);

  await context.destroy();

  return {
    statusCode: 200,
  };
};
