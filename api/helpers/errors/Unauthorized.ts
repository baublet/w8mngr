import { Context } from "api/createContext";
import { BaseError } from "./BaseError.js";

export class Unauthorized extends BaseError {
  constructor(context: Context) {
    super("Resource requires authentication", {
      context,
    });
  }
}
