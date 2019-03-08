import { createWriteStream } from "fs";

const stream = createWriteStream("logs/graphql.log", { flags: "a" });

export const LOG_LEVEL_DEBUG = 5;

export function log(data: string, level: number = LOG_LEVEL_DEBUG): void {
  const text: string = "[" + new Date().toISOString() + "] " + data + "\n";
  stream.write(text);
}
