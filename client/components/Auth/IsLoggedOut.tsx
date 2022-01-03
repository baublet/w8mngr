import React from "react";

import { useGetCurrentUserQuery } from "../../generated";

export function IsLoggedOut({ children }: React.ComponentProps<any>) {
  const { data } = useGetCurrentUserQuery({ fetchPolicy: "cache-first" });
  if (data?.currentUser) {
    return null;
  }
  return children;
}
