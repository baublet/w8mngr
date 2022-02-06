import { assertIsError } from "../../../shared";
import { hashPassword } from "../../authentication";
import { dbService } from "../../config/db";
import { Context } from "../../createContext";
import { ReturnTypeWithErrors } from "../../types";
import { emailDataService } from "../";
import { tokenDataService } from "../token";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { userAccountDataService } from "../userAccount/";
import { userDataService } from "./";
import { UserEntity } from "./types";

export async function register(
  context: Context,
  userData: {
    email: string;
    password: string;
    passwordConfirmation: string;
    role?: UserEntity["role"];
  }
): Promise<
  ReturnTypeWithErrors<{
    user: UserEntity;
    token: string;
    rememberToken: string;
  }>
> {
  if (userData.password !== userData.passwordConfirmation) {
    throw new Error("Passwords don't match");
  }
  const databaseService = await context.services.get(dbService);
  await databaseService.transact();
  try {
    const passwordHash = await hashPassword(userData.password);
    const user = await userDataService.create(context, {
      preferredName: userData.email,
      role: userData.role,
    });

    const accountExists = await userAccountDataService.accountExists(context, {
      source: "local",
      sourceIdentifier: userData.email,
    });
    if (accountExists) {
      throw new Error("Email taken");
    }

    const account = await userAccountDataService.create(context, {
      userId: user.id,
      source: "local",
      sourceIdentifier: userData.email,
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
