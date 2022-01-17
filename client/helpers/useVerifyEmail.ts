import React from "react";
import { useHistory } from "react-router-dom";

import { useVerifyEmailMutation } from "../generated";
import { useToast } from "./useToast";
import { useUrlQueryParameters } from "./useUrlQueryParameters";

export function useVerifyEmail() {
  const { replace } = useHistory();
  const { error, success } = useToast();
  const [verifyEmail] = useVerifyEmailMutation({
    onError: error,
    onCompleted: () => {
      setTimeout(() => {
        success("Email verified");
        replace(window.location.pathname);
      }, 10);
    },
  });
  const getParam = useUrlQueryParameters();
  const verifyEmailToken = getParam("verifyEmailToken");

  React.useEffect(() => {
    if (verifyEmailToken) {
      verifyEmail({ variables: { token: verifyEmailToken } });
    }
  }, [verifyEmailToken]);
}
