import { isValidTemplate, renderEmailTemplate } from "./templates/index.js";

import { Context } from "../../createContext.js";
import { EmailEntity } from "./types.js";
import { assertIsError } from "../../../shared/assertIsError.js";
import { emailService } from "../../helpers/emailService.js";
import { log } from "../../config/log.js";
import { dbService } from "../../config/db.js";
import { rootService } from "./rootService.js";

export async function sendPendingEmails(context: Context) {
  try {
    const emails = await context.services
      .get(dbService)("W8MNGR_1")
      .selectFrom("email")
      .where("sent", "=", 0)
      .selectAll()
      .limit(10)
      .execute();
    if (emails.length === 0) {
      log("debug", "Email queue is empty");
      return;
    }
    await Promise.all(emails.map((email) => sendEmail(context, email)));
  } catch (error) {}
}

async function sendEmail(context: Context, email: EmailEntity): Promise<void> {
  if (!isValidTemplate(email.templateId)) {
    await rootService.update(context, (q) => q.where("id", "=", email.id), {
      sent: 0,
    });
    log("warn", "Invalid email template ID", { email });
    await logHistory({
      context,
      email,
      text: `Invalid email templateId: ${email.templateId}`,
    });
    return;
  }

  await rootService.update(context, (q) => q.where("id", "=", email.id), {
    sent: 1,
  });

  const { subject, body } = renderEmailTemplate(
    email.templateId,
    JSON.parse(email.payload || "{}")
  );

  const sendEmail = context.services.get(emailService);
  await sendEmail({
    html: body,
    subject,
    to: [email.toEmail],
  });
}

type EmailHistory = {
  date: string;
  text: string;
};

async function logHistory({
  context,
  email,
  text,
}: {
  context: Context;
  email: EmailEntity;
  text: string;
}): Promise<void> {
  const previousHistory = email.history || "[]";
  try {
    const parsedHistory: EmailHistory[] = JSON.parse(previousHistory);
    parsedHistory.push({
      date: new Date().toISOString(),
      text,
    });
    await rootService.update(context, (q) => q.where("id", "=", email.id), {
      history: JSON.stringify(parsedHistory),
    });
  } catch (error) {
    assertIsError(error);
    log("error", "Unexpected error updating email history!", {
      error,
      email,
    });
  }
}
