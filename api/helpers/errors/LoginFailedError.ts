import { BaseError } from "./BaseError.js";

export class LoginFailedError extends BaseError {
  constructor(reason: string, details?: Record<string, any>) {
    super(reason, details);
  }
}
