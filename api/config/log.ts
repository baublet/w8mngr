import { createWriteStream } from "fs";
import stringify from "json-stringify-safe";

const stream = createWriteStream("logs/graphql.log", { flags: "a" });

const suppressConsoleLogging = process.env.SUPPRESS_CONSOLE_LOGGING === "true";

export function log(
  level: "debug" | "error" | "info" | "warn",
  message: string,
  details?: Record<string, any>
): void {
  let text: string = level + " [" + new Date().toISOString() + "] " + message;
  if (details) {
    text += " " + stringify(details);
  }
  text += "\n";
  stream.write(text);

  if (!suppressConsoleLogging) {
    console[level](text);
  }
}
