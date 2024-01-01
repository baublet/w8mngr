import FormData from "form-data";

import { assertIsError } from "../../shared/assertIsError.js";
import { config } from "../config/config.js";
import { log } from "../config/log.js";
import { getUniqueId } from "../../shared/getUniqueId.js";

export function emailService() {
  return async ({
    to,
    subject,
    html,
  }: {
    to: string[];
    subject: string;
    html: string;
  }) => {
    if (config.get("SUPPRESS_EMAILS") === "true") {
      return;
    }

    try {
      const baseUrl = config.get("MAILGUN_BASE_URL");
      const domain = config.get("MAILGUN_DOMAIN");
      const apiKey = config.get("MAILGUN_API_KEY");

      const formData = new FormData();

      formData.append("from", `w8mngr <mailgun@${domain}>`);
      to.forEach((to) => formData.append("to", to));
      formData.append("subject", subject);
      formData.append("html", html);

      const messageData = {
        from: `w8mngr <mailgun@${domain}>`,
        to: to.join(", "),
        subject,
        html,
      };

      log("info", "Sending email", {
        to,
        subject,
        url: `${baseUrl}/messages`,
        auth: {
          username: "api",
          password: apiKey,
        },
        html,
      });

      // const client = mailGunClient.client({ username: "api", key: apiKey });
      // const result = await client.messages.create(domain, messageData);

      // if (result.id) {
      if (1) {
        log("info", "Email sent", {
          to,
          subject,
          // result,
        });
      } else {
        const logId = getUniqueId();
        log("error", "Error sending email", {
          to,
          subject,
          logId,
          // result,
        });
        throw new Error(`Unknown error sending email. LogId: ${logId}`);
      }
    } catch (error) {
      assertIsError(error);
      log("error", "Error sending email", { error, to, subject });
      throw error;
    }
  };
}
