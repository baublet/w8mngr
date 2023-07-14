import React from "react";
import useLocation from "wouter/use-location";

export function useUrlQueryParameters(): (paramName: string) => string | null {
  const [location] = useLocation();
  const queryParams = React.useMemo(() => {
    const search = window.location.search;
    return new URLSearchParams(search);
  }, [location]);
  return (paramName: string) => queryParams.get(paramName);
}
