import { EmailTemplateKey } from "./templates";

export type EmailEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sent: boolean;
  toEmail: string;
  toUserId?: string;
  templateId: EmailTemplateKey;
  payload: string;
  history: string;
  idempotenceKey: string;
};
