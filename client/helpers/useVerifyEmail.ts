import React from "react";
import useLocation from "wouter/use-location";

import { useVerifyEmailMutation } from "../generated.js";
import { useToast } from "./useToast.js";
import { useUrlQueryParameters } from "./useUrlQueryParameters.js";

export function useVerifyEmail() {
  const [, navigate] = useLocation();
  const { error, success } = useToast();
  const [verifyEmail] = useVerifyEmailMutation({
    onError: error,
    onCompleted: () => {
      setTimeout(() => {
        success("Email verified");
        navigate(window.location.pathname, { replace: true });
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
