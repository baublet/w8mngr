import React from "react";
import useLocation from "wouter/use-location";

import {
  GetCurrentUserDocument,
  useLoginWithTokenMutation,
} from "../generated";
import { useToast } from "./useToast";
import { useUrlQueryParameters } from "./useUrlQueryParameters";

export function useLoginWithToken() {
  const [, navigate] = useLocation();
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
        navigate("/nutrition", { replace: true });
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
