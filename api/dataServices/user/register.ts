import { dbService } from "../../config/db";
import { Context } from "../../createContext";
import { UserEntity } from "./types";
import { userDataService } from "./";
import { userAccountDataService } from "../userAccount/";
import { hashPassword } from "../../authentication";
import { ReturnTypeWithErrors } from "../../types";
import { tokenDataService } from "../token";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { assertIsError } from "../../../shared";
import { emailDataService } from "../";

export async function register(
  context: Context,
  credentials: {
    email: string;
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
      preferredName: credentials.email,
    });

    const accountExists = await userAccountDataService.accountExists(context, {
      source: "local",
      sourceIdentifier: credentials.email,
    });
    if (accountExists) {
      throw new Error("Email taken");
    }

    const account = await userAccountDataService.create(context, {
      userId: user.id,
      source: "local",
      sourceIdentifier: credentials.email,
      passwordHash,
      verified: false,
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

    // Create email verification token and send email
    const emailVerificationToken = await tokenDataService.getOrCreate(context, {
      type: "emailVerification",
      userAccountId: account.id,
    });
    await emailDataService.create(context, {
      templateId: "verifyEmail",
      templateVariables: {
        user,
        emailVerificationToken: emailVerificationToken.token,
      },
      toUserId: user.id,
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
