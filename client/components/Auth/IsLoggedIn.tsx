import React from "react";

import { useGetCurrentUserQuery } from "../../generated";
import { ButtonSpinnerIcon } from "../Loading/ButtonSpinner";

export function IsLoggedIn({
  children,
  showLoader,
}: React.PropsWithChildren<{ showLoader?: boolean }>) {
  const { data, loading } = useGetCurrentUserQuery({
    fetchPolicy: "cache-first",
  });
  if (loading || !data?.currentUser) {
    if (showLoader) {
      return <ButtonSpinnerIcon />;
    }
  }
  return <>{children}</>;
}
