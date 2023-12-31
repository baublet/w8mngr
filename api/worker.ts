import { emailDataService } from "./dataServices/email/index.js";
import { runWithContext } from "./helpers/runWithContext.js";

export const handler = async () => {
  await Promise.all([
    runWithContext("worker", (context) =>
      emailDataService.sendPendingEmails(context)
    ),
  ]);

  return {
    statusCode: 200,
  };
};
