import { assertIsError } from "../../../shared/assertIsError.js";
import { ReturnTypeWithErrors } from "../../../shared/types.js";
import { hashPassword } from "../../authentication/hashPassword.js";
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
    console.log("made it here 2")
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
    console.log("made it here 3")
    
    const authTokenResult = await tokenDataService.getOrCreate(context, {
      type: "auth",
      userAccountId: account.id,
    });
    
    console.log("made it here 4")
    const rememberTokenResult = await tokenDataService.getOrCreate(context, {
      type: "remember",
      userAccountId: account.id,
    });
    
    console.log("made it here 5")
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
