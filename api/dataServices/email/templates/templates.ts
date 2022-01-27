import { forgotPasswordTemplate } from "./forgotPassword";
import { verifyEmailTemplate } from "./verifyEmail";
import { emailLoginTemplate } from "./emailLogin";

export const templates = {
  emailLogin: emailLoginTemplate,
  forgotPassword: forgotPasswordTemplate,
  verifyEmail: verifyEmailTemplate,
} as const;

export type Templates = typeof templates;
