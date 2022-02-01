import React from "react";

import { useGetCurrentUserQuery } from "../../generated";

export function IsLoggedIn({ children }: React.ComponentProps<any>) {
  const { data, loading  } = useGetCurrentUserQuery({ fetchPolicy: "cache-first" });
  if (loading || !data?.currentUser) {
    return null;
  }
  return children;
}
