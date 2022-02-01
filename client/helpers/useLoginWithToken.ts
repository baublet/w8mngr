import React from "react";
import { useHistory } from "react-router-dom";

import {
  GetCurrentUserDocument,
  useLoginWithTokenMutation,
} from "../generated";
import { useToast } from "./useToast";
import { useUrlQueryParameters } from "./useUrlQueryParameters";

export function useLoginWithToken() {
  const { replace } = useHistory();
  const { error, success } = useToast();
  const [login] = useLoginWithTokenMutation({
    refetchQueries: [GetCurrentUserDocument],
    awaitRefetchQueries: true,
    onError: (err) => {
      error(err);
    },
    onCompleted: () => {
      setTimeout(() => {
        success("Logged in");
        replace("/nutrition");
      }, 50);
    },
  });
  const getParam = useUrlQueryParameters();
  const loginToken = getParam("loginToken");

  React.useEffect(() => {
    if (loginToken) {
      login({
        variables: {
          input: {
            loginToken,
          },
        },
      });
    }
  }, [loginToken]);
}
