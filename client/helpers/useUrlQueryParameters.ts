import React from "react";

export function useUrlQueryParameters() {
  const fullUrl = window.location.origin + window.location.search;
  const urlParams = React.useMemo(() => new URL(fullUrl), [fullUrl]);
  return (paramName: string) => urlParams.searchParams.get(paramName);
}
