import { ulid } from "ulid";

import { dbService } from "../../config/db";
import { Context } from "../../createContext";
import { UserEntity } from "./types";
import { userDataService } from "./";
import { userAccountDataService } from "../userAccount/";
import { createDigest } from "../../authentication";
import { ReturnTypeWithErrors, assertIsError } from "../../types";

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
    throw new Error(`Passwords don't match`);
  }
  const databaseService = await context.services.get(dbService);
  await databaseService.transact();
  try {
    const passwordDigest = createDigest(credentials.password);
    const user = await userDataService.create(context, {
      preferredName: credentials.username,
    });

    const token = ulid();
    const rememberToken = ulid();

    const accountExists = await userAccountDataService.accountExists(context, {
      source: "local",
      sourceIdentifier: credentials.username,
    });
    if (accountExists) {
      throw new Error("Username taken");
    }

    await userAccountDataService.create(context, {
      userId: user.id,
      source: "local",
      sourceIdentifier: credentials.username,
      passwordDigest,
      tokenDigest: createDigest(token),
      rememberTokenDigest: createDigest(rememberToken),
    });

    await databaseService.commit();

    return {
      user,
      token,
      rememberToken,
    };
  } catch (error) {
    await databaseService.rollback(error);
    assertIsError(error);
    return error;
  }
}
