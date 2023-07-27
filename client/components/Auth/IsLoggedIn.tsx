import React from "react";

import { useGetCurrentUserQuery } from "../../generated";
import { ButtonSpinnerIcon } from "../Loading/ButtonSpinner";

export function IsLoggedIn({
  children,
  showLoader,
}: React.PropsWithChildren<{ showLoader?: boolean }>) {
  const { data, loading } = useGetCurrentUserQuery({
    fetchPolicy: "cache-first",
    pollInterval: 10000
  });
  console.log({ data })
  if (loading || !data?.currentUser) {
    if (loading && showLoader) {
      return <ButtonSpinnerIcon />;
    }
    return null;
  }
  return <>{children}</>;
}
