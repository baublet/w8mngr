import { ulid } from "ulid";

import { Context } from "../../createContext";
import { userAccountDataService } from "../";
import { EmailEntity, emailDataService } from "./";
import { getQuery } from "./query";
import { EmailTemplateKey, EmailTemplates } from "./templates";

export async function create<TTemplateKey extends EmailTemplateKey>(
  context: Context,
  {
    toUserId,
    templateId,
    templateVariables,
    idempotenceKey,
  }: {
    toUserId: string;
    templateId: TTemplateKey;
    templateVariables: Parameters<EmailTemplates[TTemplateKey]>[0];
    idempotenceKey: string;
  }
): Promise<EmailEntity> {
  const accounts = await userAccountDataService.findBy(context, (q) =>
    q.where("userId", "=", toUserId)
  );
  const toEmail = accounts.reduce((email, account) => {
    if (email) {
      return email;
    }
    if (account.sourceIdentifier.includes("@")) {
      return account.sourceIdentifier;
    }
    return email;
  }, "");

  if (!toEmail) {
    throw new Error(`No email found for user: ${toUserId}`);
  }

  const queryFactory = await getQuery(context);
  const insertedEmailId = ulid();
  await queryFactory().insert({
    id: insertedEmailId,
    toUserId,
    sent: false,
    templateId,
    payload: JSON.stringify(templateVariables),
    toEmail,
    idempotenceKey,
  });

  await emailDataService.sendPendingEmails(context);

  return emailDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", insertedEmailId)
  );
}
