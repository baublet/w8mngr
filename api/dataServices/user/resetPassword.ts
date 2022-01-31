import { dbService } from "../../config/db";
import { Context } from "../../createContext";
import { UserEntity } from "./types";
import { userDataService } from "./";
import { userAccountDataService } from "../userAccount/";
import { createDigest, hashPassword } from "../../authentication";
import { ReturnTypeWithErrors } from "../../types";
import { tokenDataService } from "../token";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { assertIsError } from "../../../shared";
import { emailDataService } from "../";

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

  const tokenDigest = createDigest(credentials.passwordResetToken);
  const token = await tokenDataService.findOneOrFail(context, (q) =>
    q
      .where("tokenDigest", "=", tokenDigest)
      .andWhere("type", "=", "passwordReset")
  );

  const databaseService = await context.services.get(dbService);
  await databaseService.transact();
  try {
    const passwordHash = await hashPassword(credentials.password);

    const account = await userAccountDataService.findOneOrFail(context, (q) =>
      q.where("id", "=", token.userAccountId)
    );

    await userAccountDataService.update(
      context,
      (q) => q.where("id", "=", account.id),
      { passwordHash }
    );

    const user = await userDataService.findOneOrFail(context, (q) =>
      q.where("id", "=", account.userId)
    );

    await tokenDataService.deleteBy(context, (q) =>
      q.where("id", "=", token.id)
    );

    const authTokenResult = await tokenDataService.getOrCreate(context, {
      type: "auth",
      userAccountId: account.id,
    });

    const rememberTokenResult = await tokenDataService.getOrCreate(context, {
      type: "remember",
      userAccountId: account.id,
    });

    await databaseService.commit();

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
    await databaseService.rollback(error);
    assertIsError(error);
    return error;
  }
}
