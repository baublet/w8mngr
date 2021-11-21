import { ulid } from "ulid";

import { Context } from "../../createContext";
import { UserEntity } from "./types";
import { userDataService } from "./";
import { userAccountDataService } from "../userAccount/";
import { createDigest } from "../../authentication";
import { ReturnTypeWithErrors, assertIsError } from "../../types";

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
  try {
    const passwordDigest = createDigest(credentials.password);
    const account = await userAccountDataService.findOneOrFail(context, (q) =>
      q
        .where("sourceIdentifier", "=", credentials.username)
        .andWhere("passwordDigest", "=", passwordDigest)
    );
    const user = await userDataService.findOneOrFail(context, (q) =>
      q.where("id", "=", account.userId)
    );

    const token = ulid();
    const rememberToken = ulid();

    await userAccountDataService.update(
      context,
      (q) => q.where("id", "=", account.id),
      {
        tokenDigest: createDigest(token),
        rememberTokenDigest: createDigest(rememberToken),
      }
    );

    return {
      user,
      token,
      rememberToken,
    };
  } catch (error) {
    assertIsError(error);
    return error;
  }
}
