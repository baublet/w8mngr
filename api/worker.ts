import { emailDataService } from "./dataServices";
import { runWithContext } from "./helpers";

export const handler = async () => {
  await runWithContext("worker", (context) =>
    emailDataService.sendPendingEmails(context)
  );

  return {
    statusCode: 200,
  };
};
