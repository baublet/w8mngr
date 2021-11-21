import { ulid } from "ulid";

import { dbService } from "../../config/db";
import { Context } from "../../createContext";
import { UserEntity } from "./types";
import { userDataService } from "./";
import { userAccountDataService } from "../userAccount/";
import { createDigest, hashPassword } from "../../authentication";
import { ReturnTypeWithErrors, assertIsError } from "../../types";
import { tokenDataService } from "../token";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";

export async function register(
  context: Context,
  credentials: {
    username: string;
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
  const databaseService = await context.services.get(dbService);
  await databaseService.transact();
  try {
    const passwordHash = await hashPassword(credentials.password);
    const user = await userDataService.create(context, {
      preferredName: credentials.username,
    });

    const accountExists = await userAccountDataService.accountExists(context, {
      source: "local",
      sourceIdentifier: credentials.username,
    });
    if (accountExists) {
      throw new Error("Username taken");
    }

    const account = await userAccountDataService.create(context, {
      userId: user.id,
      source: "local",
      sourceIdentifier: credentials.username,
      passwordHash,
    });

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
