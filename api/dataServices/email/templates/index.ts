import { assertIsError } from "../../../../shared/assertIsError.js";
import { log } from "../../../config/log.js";
import { Context } from "../../../createContext.js";
import { Templates, templates } from "./templates.js";

export type EmailTemplateKey = keyof Templates;
export type EmailTemplates = Templates;

export function renderEmailTemplate<T extends keyof Templates>(
  context: Context,
  template: T,
  args: Parameters<Templates[T]>[0] extends undefined
    ? never
    : Parameters<Templates[T]>[0]
) {
  try {
    return templates[template](args as any);
  } catch (error) {
    assertIsError(error);
    log(context, "error", "Unexpected error parsing email template", {
      template,
      templatesAvailable: Object.keys(templates),
      args,
    });
    throw Error;
  }
}

export function isValidTemplate(template: string): template is keyof Templates {
  return templates.hasOwnProperty(template);
}
