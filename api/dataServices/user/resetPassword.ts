import { assertIsError } from "../../../shared/assertIsError.js";
import { ReturnTypeWithErrors } from "../../../shared/types.js";
import { createDigest } from "../../authentication/createDigest.js";
import { hashPassword } from "../../authentication/hashPassword.js";
import { configService } from "../../config/config.js";
import { Context } from "../../createContext.js";
import { tokenDataService } from "../token/index.js";
import { TOKEN_EXPIRY_OFFSET } from "../token/types.js";
import { userAccountDataService } from "../userAccount/index.js";
import { userDataService } from "./index.js";
import { UserEntity } from "./types.js";

export async function resetPassword(
  context: Context,
  credentials: {
    passwordResetToken: string;
    password: string;
    passwordConfirmation: string;
  }
): Promise<
  ReturnTypeWithErrors<{
    user: UserEntity;
    token: string;
    rememberToken: string;
  }>
> {
  if (credentials.password !== credentials.passwordConfirmation) {
    throw new Error("Passwords don't match");
  }

  const tokenDigest = await createDigest(credentials.passwordResetToken);
  const token = await tokenDataService.findOneOrFailBy(context, (q) =>
    q.where("tokenDigest", "=", tokenDigest).where("type", "=", "passwordReset")
  );

  try {
    const salt = context.services.get(configService).get("SALT");
    const passwordHash = await hashPassword(credentials.password, salt);

    const account = await userAccountDataService.findOneOrFail(
      context,
      token.userAccountId
    );

    await userAccountDataService.update(
      context,
      (q) => q.where("id", "=", account.id),
      { passwordHash }
    );

    const user = await userDataService.findOneOrFail(context, account.userId);

    await tokenDataService.deleteByIds(context, [token.id]);

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
    context.setCookie("w8mngrRemember", authTokenResult.token, {
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
