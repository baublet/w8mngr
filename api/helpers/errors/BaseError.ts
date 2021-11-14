import stringify from "json-stringify-safe";

export class BaseError extends Error {
  constructor(message: string, details?: Record<string, any>) {
    super(`${message}${details ? " " + stringify(details) : ""}`);
  }
}
