import { assertIsError } from "../../../shared";
import { ReturnTypeWithErrors } from "../../../shared/types";
import { createDigest } from "../../authentication/createDigest";
import { hashPassword } from "../../authentication/hashPassword";
import { Context } from "../../createContext";
import { tokenDataService } from "../token";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { userAccountDataService } from "../userAccount/";
import { userDataService } from "./";
import { UserEntity } from "./types";

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
    const passwordHash = await hashPassword(credentials.password);

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
