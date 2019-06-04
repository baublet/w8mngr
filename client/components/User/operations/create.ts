import userQuery from "shared/queries/user";
import { ApolloCache } from "apollo-cache";
import { History } from "history";
import { Dispatch } from "react";

export default function registerAction(
  cache: ApolloCache<any>,
  data: any,
  history: History,
  setError: Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: Dispatch<React.SetStateAction<string>>
): void {
  if (data.register && data.register.user) {
    localStorage.setItem("token", data.register.token);
    cache.writeQuery({
      query: userQuery,
      data: { user: data.register.user }
    });
    history.push("/");
  } else {
    setError(true);
    setErrorMessage("An account with that email exists.");
  }
}
