import { assertIsError } from "../../../shared";
import { ReturnTypeWithErrors } from "../../../shared/types";
import { hashPassword } from "../../authentication/hashPassword";
import { Context } from "../../createContext";
import { emailDataService } from "../email";
import { tokenDataService } from "../token";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { userAccountDataService } from "../userAccount/";
import { create } from "./create";
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

  try {
    const passwordHash = await hashPassword(userData.password);
    const user = await create(context, {
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
      verified: 0,
    });

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
      idempotenceKey: `email-verification-${emailVerificationToken.token}}`,
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
