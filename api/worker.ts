import { createContext } from "./createContext";
import { emailDataService } from "./dataServices";
import { schedule } from "@netlify/functions";
import { ulid } from "ulid";

// Local cron schedule: every minute (worker jobs are idempotent, so this is fine)
export const cronSchedule = "* * * * *";

export const handlerFn = async () => {
  const context = await createContext({
    clientId: `hourly-worker-${ulid()}`,
  });

  await emailDataService.sendPendingEmails(context);

  await context.destroy();

  return {
    statusCode: 200,
  };
};

export const handler = schedule("@hourly", handlerFn);
