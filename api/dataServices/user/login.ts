import { assertIsError } from "../../../shared";
import { doesHashMatch } from "../../authentication";
import { dbService } from "../../config/db";
import { log } from "../../config/log";
import { Context } from "../../createContext";
import { errors } from "../../helpers";
import { ReturnTypeWithErrors } from "../../types";
import { tokenDataService } from "../token";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { userAccountDataService } from "../userAccount";
import { rootService } from "./rootService";
import { UserEntity } from "./types";

export async function login(
  context: Context,
  credentials: {
    email: string;
    password: string;
  }
): Promise<
  ReturnTypeWithErrors<{
    user: UserEntity;
    token: string;
    rememberToken: string;
  }>
> {
  const databaseService = await context.services.get(dbService);
  await databaseService.transact();
  try {
    const account = await userAccountDataService.findOneOrFail(context, (q) =>
      q.where("sourceIdentifier", "=", credentials.email)
    );

    const passwordsMatch = await doesHashMatch(
      credentials.password,
      account.passwordHash
    );
    if (!passwordsMatch) {
      log("error", "Login attempt failed. Passwords don't match.", {
        account,
      });
      throw new errors.LoginFailedError("Invalid credentials");
    }

    const user = await rootService.findOneOrFail(context, (q) =>
      q.where("id", "=", account.userId)
    );

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
    context.setCookie("w8mngrRemember", rememberTokenResult.token, {
      expires: new Date(Date.now() + TOKEN_EXPIRY_OFFSET.remember),
    });

    await databaseService.commit();

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
