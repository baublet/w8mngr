import { assertIsError } from "../../../shared/assertIsError.js";
import { filterFalsyKeys } from "../../../shared/filterFalsyKeys.js";
import { ReturnTypeWithErrors } from "../../../shared/types.js";
import { Context } from "../../createContext.js";
import { tokenDataService } from "../token/index.js";

export async function logout(
  context: Context
): Promise<ReturnTypeWithErrors<string[]>> {
  await tokenDataService.deleteExpiredTokens(context);
  try {
    const { authToken, rememberToken } = context.getAuthTokens();
    const tokensToExpire = filterFalsyKeys([authToken, rememberToken]);

    await tokenDataService.deleteByTokenDigests(context, tokensToExpire);

    context.setCookie("w8mngrAuth", undefined);
    context.setCookie("w8mngrRemember", undefined);

    return tokensToExpire;
  } catch (error) {
    assertIsError(error);
    return error;
  }
}
