import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}
