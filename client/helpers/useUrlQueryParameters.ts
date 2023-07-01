import { useSearchParams } from "react-router-dom";

export function useUrlQueryParameters(): (paramName: string) => string | null {
  const [searchParams] = useSearchParams();
  return (paramName: string) => searchParams.get(paramName);
}
