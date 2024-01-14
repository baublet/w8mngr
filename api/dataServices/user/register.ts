import { assertIsError } from "../../../shared/assertIsError.js";
import { ReturnTypeWithErrors } from "../../../shared/types.js";
import { hashPassword } from "../../authentication/hashPassword.js";
import { configService } from "../../config/config.js";
import { Context } from "../../createContext.js";
import { emailDataService } from "../email/index.js";
import { tokenDataService } from "../token/index.js";
import { TOKEN_EXPIRY_OFFSET } from "../token/types.js";
import { userAccountDataService } from "../userAccount/index.js";
import { create } from "./create.js";
import { UserEntity } from "./types.js";

export async function register(
  context: Context,
  userData: {
    email: string;
    password: string;
    passwordConfirmation: string;
    role?: UserEntity["role"];
  },
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
    const salt = context.services.get(configService).get("SALT");
    const passwordHash = await hashPassword(userData.password, salt);
    const user = await create(context, {
      preferredName: userData.email,
      role: userData.role,
    });

    const accountExists = await userAccountDataService.accountExists(context, {
      source: "local",
      sourceIdentifier: userData.email,
    });
    if (accountExists) {
      throw new Error("That email address is already registered");
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
    const publicUrl = context.services.get(configService).get("PUBLIC_URL");
    await emailDataService.create(context, {
      templateId: "verifyEmail",
      templateVariables: {
        link: `${publicUrl}/?verifyEmailToken=${emailVerificationToken}`,
        user,
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
