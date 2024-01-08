import React from "react";

import { useGetCurrentUserQuery } from "../../generated";
import { ButtonSpinnerIcon } from "../Loading/ButtonSpinner";

export function IsLoggedIn({
  children,
  showLoader,
}: React.PropsWithChildren<{ showLoader?: boolean }>) {
  const { data, loading } = useGetCurrentUserQuery({
    fetchPolicy: "cache-and-network",
    pollInterval: 60000
  });
  if (loading || !data?.currentUser) {
    if (loading && showLoader) {
      return <ButtonSpinnerIcon />;
    }
    return null;
  }
  return children;
}
