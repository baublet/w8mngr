import { emailDataService } from "./dataServices/email";
import { runWithContext } from "./helpers/runWithContext";

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
