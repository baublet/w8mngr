import { Context } from "../../createContext";
import { tokenDataService } from "../token";
import { ReturnTypeWithErrors } from "../../types";
import { dbService } from "../../config";
import { assertIsError, filterFalsyKeys } from "../../../shared";

export async function logout(
  context: Context
): Promise<ReturnTypeWithErrors<string[]>> {
  await tokenDataService.deleteExpiredTokens(context);
  const databaseService = await context.services.get(dbService);
  await databaseService.transact();
  try {
    const authToken: string | undefined =
      context.getRequest()?.cookies?.w8mngrAuth;
    const rememberToken: string | undefined =
      context.getRequest()?.cookies?.w8mngrRemember;
    const tokensToExpire: string[] = filterFalsyKeys([
      authToken,
      rememberToken,
    ]);

    await tokenDataService.deleteByTokenDigests(context, tokensToExpire);

    context.setCookie("w8mngrAuth", undefined);
    context.setCookie("w8mngrRemember", undefined);

    await databaseService.commit();

    return tokensToExpire;
  } catch (error) {
    await databaseService.rollback(error);
    assertIsError(error);
    return error;
  }
}
