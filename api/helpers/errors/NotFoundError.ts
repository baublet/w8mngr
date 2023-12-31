import { BaseError } from "./BaseError.js";

export class NotFoundError extends BaseError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}
