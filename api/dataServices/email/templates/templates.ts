import { forgotPasswordTemplate } from "./forgotPassword.js";
import { verifyEmailTemplate } from "./verifyEmail.js";
import { emailLoginTemplate } from "./emailLogin.js";

export const templates = {
  emailLogin: emailLoginTemplate,
  forgotPassword: forgotPasswordTemplate,
  verifyEmail: verifyEmailTemplate,
} as const;

export type Templates = typeof templates;
