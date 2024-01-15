import { NetworkStatus } from "@apollo/client";
import React from "react";
import useLocation from "wouter/use-location";
import { useRoute } from "wouter";

import { useNavigateToUrl } from "./useNavigateToUrl.js";
import { useUrlSearchParams } from "./useUrlSearchParams.js";

type HookFunction = (args: {
  fetchPolicy?: any;
  variables: {
    input: {
      before?: string;
      after?: string;
      first?: number;
      last?: number;
      filter?: Record<string, any>;
    };
  };
}) => {
  networkStatus: NetworkStatus;
  loading: boolean;
  data?: Record<string, any>;
};

type NotNullOrUndefined<T> = Exclude<T, null | undefined>;

type HookFilters<T extends HookFunction> = NotNullOrUndefined<
  NotNullOrUndefined<Parameters<T>[0]["variables"]>["input"]
>["filter"];

type GetConnectionFn<T extends HookFunction, TNode = any> = (
  data: ReturnType<T>["data"],
) =>
  | undefined
  | {
      pageInfo: {
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
      edges: {
        cursor: string;
        node: TNode;
      }[];
    };

export function usePaginatedQuery<
  THookFn extends HookFunction,
  TGetConnection extends GetConnectionFn<THookFn>,
>(
  useQuery: THookFn,
  {
    filter,
    perPage = 3,
    getConnection,
  }: {
    filter?: HookFilters<THookFn>;
    perPage?: number;
    getConnection: TGetConnection;
  },
): {
  loading: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  nextPageLink: string;
  previousPageLink: string;
  nextPage: () => void;
  previousPage: () => void;
  nodes: NotNullOrUndefined<
    NotNullOrUndefined<ReturnType<TGetConnection>>["edges"]
  >[number]["node"][];
} {
  const navigate = useNavigateToUrl();
  const queryParams = useUrlSearchParams();
  const [baseUrl] = useLocation();

  const cursor = queryParams.get("cursor");
  const beforeOrAfter = queryParams.get("beforeOrAfter") || "after";
  const firstOrLast = queryParams.get("firstOrLast") || "first";

  const { data, networkStatus } = useQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        [beforeOrAfter]: cursor,
        [firstOrLast]: perPage,
        filter,
      },
    },
  });

  const connection = getConnection(data) || {
    edges: [],
    pageInfo: {
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
  const edges = connection.edges;
  const nodes = edges.map((edge) => edge.node);
  const firstCursor = edges[0]?.cursor;
  const lastCursor = edges[edges.length - 1]?.cursor;
  const loading = isLoading(networkStatus);

  const previousPageLink = React.useMemo(() => {
    if (!firstCursor) {
      return "";
    }
    const params = new URLSearchParams(queryParams.toString());
    params.set("cursor", firstCursor);
    params.set("beforeOrAfter", "before");
    params.set("firstOrLast", "last");
    return `${baseUrl}?${params.toString()}`;
  }, [queryParams, data]);

  const nextPageLink = React.useMemo(() => {
    if (!lastCursor) {
      return "";
    }
    const params = new URLSearchParams(queryParams.toString());
    params.set("cursor", lastCursor);
    params.set("beforeOrAfter", "after");
    params.set("firstOrLast", "first");
    return `${baseUrl}?${params.toString()}`;
  }, [queryParams, data]);

  return {
    loading,
    nodes,
    totalCount: connection.pageInfo.totalCount,
    hasNextPage: connection.pageInfo.hasNextPage,
    hasPreviousPage: connection.pageInfo.hasPreviousPage,
    nextPageLink,
    previousPageLink,
    nextPage: () => {
      queryParams.set("cursor", lastCursor);
      queryParams.set("beforeOrAfter", "after");
      queryParams.set("firstOrLast", "first");
      navigate(`${baseUrl}?${queryParams.toString()}`);
    },
    previousPage: () => {
      queryParams.set("cursor", firstCursor);
      queryParams.set("beforeOrAfter", "before");
      queryParams.set("firstOrLast", "last");
      navigate(`${baseUrl}?${queryParams.toString()}`);
    },
  } as any;
}

function isLoading(status: NetworkStatus): boolean {
  switch (status) {
    case NetworkStatus.loading:
      return true;
    case NetworkStatus.fetchMore:
      return true;
    case NetworkStatus.setVariables:
      return true;
  }
  return false;
}
