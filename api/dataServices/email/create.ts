import { Context } from "../../createContext";
import { userAccountDataService } from "../userAccount";
import { EmailEntity, emailDataService } from "./";
import { EmailTemplateKey, EmailTemplates } from "./templates";
import { dbService } from "../../config/db";
import { assertIsTruthy } from "../../../shared/assertIsTruthy";
import { getUniqueId } from "../../../shared/getUniqueId";

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
    if (account.sourceIdentifier?.includes("@")) {
      return account.sourceIdentifier;
    }
    return email;
  }, "");

  if (!toEmail) {
    throw new Error(`No email found for user: ${toUserId}`);
  }

  const insertedEmailId = getUniqueId();
  const insertedResult = await context.services
    .get(dbService)("W8MNGR_1")
    .insertInto("email")
    .values([
      {
        id: insertedEmailId,
        toUserId,
        sent: 0,
        templateId,
        payload: JSON.stringify(templateVariables),
        toEmail,
        idempotenceKey,
      },
    ])
    .returningAll()
    .execute();

  await emailDataService.sendPendingEmails(context);

  const insertedEmail = insertedResult[0];
  assertIsTruthy(insertedEmail, "Email failed to insert");

  return insertedEmail;
}
