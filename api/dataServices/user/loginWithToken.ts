import { assertIsError } from "../../../shared";
import { ReturnTypeWithErrors } from "../../../shared/types";
import { createDigest } from "../../authentication";
import { dbService } from "../../config/db";
import { Context } from "../../createContext";
import { errors } from "../../helpers";
import { tokenDataService } from "../token";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { userAccountDataService } from "../userAccount/";
import { userDataService } from "./";
import { UserEntity } from "./types";

export async function loginWithToken(
  context: Context,
  input: {
    loginToken: string;
  }
): Promise<
  ReturnTypeWithErrors<{
    currentUser: UserEntity;
    errors: string[];
  }>
> {
  const databaseService = await context.services.get(dbService);
  await databaseService.transact();
  try {
    const tokenDigest = createDigest(input.loginToken);
    const token = await tokenDataService.findOneOrFail(context, (q) =>
      q.where("tokenDigest", "=", tokenDigest)
    );
    await tokenDataService.deleteByIds(context, [token.id]);

    const account = await userAccountDataService.findOneOrFail(context, (q) =>
      q.where("id", "=", token.userAccountId)
    );

    const user = await userDataService.findOneOrFail(context, (q) =>
      q.where("id", "=", account.userId)
    );

    const authTokenResult = await tokenDataService.getOrCreate(context, {
      type: "auth",
      userAccountId: account.id,
    });

    const rememberTokenResult = await tokenDataService.getOrCreate(context, {
      type: "remember",
      userAccountId: account.id,
    });

    context.setCookie("w8mngrAuth", authTokenResult.token, {
      expires: new Date(Date.now() + TOKEN_EXPIRY_OFFSET.auth),
    });
    context.setCookie("w8mngrRemember", rememberTokenResult.token, {
      expires: new Date(Date.now() + TOKEN_EXPIRY_OFFSET.remember),
    });

    await databaseService.commit();

    return {
      currentUser: user,
      errors: [],
    };
  } catch (error) {
    await databaseService.rollback(error);
    assertIsError(error);
    return new errors.LoginFailedError("Invalid login token", { input });
  }
}
