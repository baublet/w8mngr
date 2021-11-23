import { Context } from "../../createContext";
import { UserEntity } from "./types";
import { userDataService } from "./";
import { userAccountDataService } from "../userAccount/";
import { tokenDataService } from "../token";
import { doesHashMatch } from "../../authentication";
import { ReturnTypeWithErrors } from "../../types";
import { errors } from "../../helpers";
import { log } from "../../config";
import { dbService } from "../../config";
import { TOKEN_EXPIRY_OFFSET } from "../token/types";
import { assertIsError } from "../../../shared";

export async function login(
  context: Context,
  credentials: {
    username: string;
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
      q.where("sourceIdentifier", "=", credentials.username)
    );

    const passwordsMatch = await doesHashMatch(
      credentials.password,
      account.passwordHash
    );
    if (!passwordsMatch) {
      log("error", "Login attempt failed. Passwords don't match.", {
        account,
      });
      throw new errors.LoginFailedError("Invalid credentials", {
        reason: "Hashes don't match",
      });
    }

    const user = await userDataService.findOneOrFail(context, (q) =>
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
