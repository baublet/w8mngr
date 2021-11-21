import { BaseError } from "./BaseError";

export class LoginFailedError extends BaseError {
  constructor(reason: string, details?: Record<string, any>) {
    super(reason, details);
  }
}
