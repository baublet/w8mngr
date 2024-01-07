import { assertIsError } from "../../../shared/assertIsError.js";
import { ReturnTypeWithErrors } from "../../../shared/types.js";
import { doesHashMatch } from "../../authentication/doesHashMatch.js";
import { log } from "../../config/log.js";
import { Context } from "../../createContext.js";
import { LoginFailedError } from "../../helpers/errors/LoginFailedError.js";
import { tokenDataService } from "../token/index.js";
import { TOKEN_EXPIRY_OFFSET } from "../token/types.js";
import { userAccountDataService } from "../userAccount/index.js";
import { rootService } from "./rootService.js";
import { UserEntity } from "./types.js";

export async function login(
  context: Context,
  credentials: {
    email: string;
    password: string;
  }
): Promise<
  ReturnTypeWithErrors<{
    user: UserEntity;
    token: string;
    rememberToken: string;
  }>
> {
  try {
    const account = await userAccountDataService.findOneOrFailBy(context, (q) =>
      q.where("sourceIdentifier", "=", credentials.email)
    );
    const passwordsMatch = await doesHashMatch(
      context,
      credentials.password,
      account.passwordHash
    );
    if (!passwordsMatch) {
      log(context, "error", "Login attempt failed. Passwords don't match.", {
        account,
      });
      throw new LoginFailedError("Invalid credentials");
    }

    const user = await rootService.findOneOrFail(context, account.userId);

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
      user,
      token: authTokenResult.token,
      rememberToken: rememberTokenResult.token,
    };
  } catch (error) {
    assertIsError(error);
    return error;
  }
}
