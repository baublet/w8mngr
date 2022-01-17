import { forgotPasswordTemplate } from "./forgotPassword";
import { verifyEmailTemplate } from "./verifyEmail"

export const templates = {
  forgotPassword: forgotPasswordTemplate,
  verifyEmail: verifyEmailTemplate,
} as const;

export type Templates = typeof templates;
