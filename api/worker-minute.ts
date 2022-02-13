import { createContext } from "./createContext";
import { emailDataService } from "./dataServices";
import { schedule } from "@netlify/functions";
import { ulid } from "ulid";

export const cronSchedule = "* * * * *";

export const handlerFn = async () => {
  const context = await createContext({
    clientId: `minute-worker-${ulid()}`,
  });

  await emailDataService.sendPendingEmails(context);

  await context.destroy();

  return {
    statusCode: 200,
  };
};

export const handler = schedule(cronSchedule, handlerFn);
