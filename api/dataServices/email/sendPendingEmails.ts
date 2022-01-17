import { Context, createContext } from "../../createContext";
import { log } from "../../config";
import { emailDataService, EmailEntity } from "./index";
import { getQuery } from "./query";
import { isValidTemplate, renderEmailTemplate } from "./templates";
import { assertIsError } from "../../../shared";
import { emailService, registerRecurringTask } from "../../helpers";

registerRecurringTask({
  taskKey: "sendPendingEmails",
  task: async () => {
    await sendPendingEmails(
      createContext({
        clientId: "robot",
      })
    );
  },
  intervalMs: 10000,
});

export async function sendPendingEmails(context: Context) {
  try {
    const queryFactory = await getQuery(context);
    const emails = await queryFactory()
      .select("*")
      .where("sent", "=", false)
      .limit(1);
    if (emails.length === 0) {
      log("debug", "Email queue is empty");
      return;
    }
    await Promise.all(emails.map((email) => sendEmail(context, email)));
  } catch (error) {}
}

async function sendEmail(context: Context, email: EmailEntity): Promise<void> {
  if (!isValidTemplate(email.templateId)) {
    await emailDataService.update(
      context,
      (q) => q.where("id", "=", email.id),
      { sent: false }
    );
    log("warn", "Invalid email template ID", { email });
    await logHistory({
      context,
      email,
      text: `Invalid email templateId: ${email.templateId}`,
    });
    return;
  }

  await emailDataService.update(context, (q) => q.where("id", "=", email.id), {
    sent: true,
  });

  const { subject, body } = renderEmailTemplate(
    email.templateId,
    JSON.parse(email.payload)
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
    await emailDataService.update(
      context,
      (q) => q.where("id", "=", email.id),
      {
        history: JSON.stringify(parsedHistory),
      }
    );
  } catch (error) {
    assertIsError(error);
    log("error", "Unexpected error updating email history!", {
      error,
      email,
    });
  }
}
