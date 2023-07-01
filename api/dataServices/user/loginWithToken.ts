import { assertIsError } from "../../../shared";
import { ReturnTypeWithErrors } from "../../../shared/types";
import { createDigest } from "../../authentication/createDigest";
import { Context } from "../../createContext";
import { LoginFailedError } from "../../helpers/errors/LoginFailedError";
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
  try {
    const tokenDigest = await createDigest(input.loginToken);
    const token = await tokenDataService.findOneOrFailBy(context, (q) =>
      q.where("tokenDigest", "=", tokenDigest)
    );
    await tokenDataService.deleteByIds(context, [token.id]);

    const account = await userAccountDataService.findOneOrFail(
      context,
      token.userAccountId
    );

    const user = await userDataService.findOneOrFail(context, account.userId);

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

    return {
      currentUser: user,
      errors: [],
    };
  } catch (error) {
    assertIsError(error);
    return new LoginFailedError("Invalid login token", { input });
  }
}
