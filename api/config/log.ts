import stringify from "json-stringify-safe";

import { config } from "./config";

const suppressConsoleLogging = config.get("SUPPRESS_CONSOLE_LOGGING");

export function log(
  level: "debug" | "error" | "info" | "warn",
  message: string,
  details?: Record<string, any>
): void {
  if (suppressConsoleLogging) {
    return;
  }
  let text: string = level + " [" + new Date().toISOString() + "] " + message;
  if (details) {
    const withSerializedErrors = Object.entries(details).reduce(
      (withSerializedErrors, [key, value]) => {
        if (value instanceof Error) {
          withSerializedErrors[key] = {
            message: value.message,
            stack: value.stack,
          };
        } else {
          withSerializedErrors[key] = value;
        }
        return withSerializedErrors;
      },
      {} as Record<string, any>
    );
    text += " " + stringify(withSerializedErrors);
  }

  console[level](text);
}
