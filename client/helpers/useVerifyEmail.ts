import React from "react";
import { useNavigate } from "react-router-dom";

import { useVerifyEmailMutation } from "../generated";
import { useToast } from "./useToast";
import { useUrlQueryParameters } from "./useUrlQueryParameters";

export function useVerifyEmail() {
  const navigate = useNavigate();
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
