import { NetworkStatus } from "@apollo/client";

export function isApolloLoadingStatus(status: NetworkStatus): boolean {
  switch (status) {
    case NetworkStatus.loading:
      return true;
    case NetworkStatus.fetchMore:
      return true;
    case NetworkStatus.refetch:
      return true;
    case NetworkStatus.setVariables:
      return true;
  }
  return false;
}
