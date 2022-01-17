import { ulid } from "ulid";

import { Context } from "../../createContext";
import { emailDataService, EmailEntity } from "./";
import { userAccountDataService } from "../";
import { EmailTemplateKey, EmailTemplates } from "./templates";
import { getQuery } from "./query";

export async function create<TTemplateKey extends EmailTemplateKey>(
  context: Context,
  {
    toUserId,
    templateId,
    templateVariables,
  }: {
    toUserId: string;
    templateId: TTemplateKey;
    templateVariables: Parameters<EmailTemplates[TTemplateKey]>[0];
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
  });

  await emailDataService.sendPendingEmails(context);

  return emailDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", insertedEmailId)
  );
}
