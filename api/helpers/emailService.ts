import { ulid } from "ulid";
import FormData from "form-data";
import MailGun from "mailgun.js";

import { assertIsError } from "../../shared";
import { log } from "../config";

const mailGunClient = new MailGun(FormData);

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
    try {
      const baseUrl = process.env.MAILGUN_BASE_URL || "";
      const domain = process.env.MAILGUN_DOMAIN || "";
      const apiKey = process.env.MAILGUN_API_KEY || "";

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

      const client = mailGunClient.client({ username: "api", key: apiKey });
      const result = await client.messages.create(domain, messageData);

      if (result.id) {
        log("info", "Email sent", {
          to,
          subject,
          result,
        });
      } else {
        const logId = ulid();
        log("error", "Error sending email", {
          to,
          subject,
          logId,
          result,
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
