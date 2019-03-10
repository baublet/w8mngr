import * as React from "react";
import Loading from "client/components/Loading/Primary";

import { Query, QueryResult } from "react-apollo";
import { DocumentNode } from "graphql";

interface ApolloQueryProps {
  query: DocumentNode;
  children: (result: QueryResult) => React.ReactNode;
  variables?: any;
  pollInterval?: number;
  ssr?: boolean;
  loading?: () => React.ReactNode | false;
  hideLoader?: true;
}

export default function ApolloQuery(props: ApolloQueryProps) {
  const { hideLoader = true, children, loading: loader, ...queryProps } = props;

  return (
    <Query {...queryProps}>
      {({ loading, error, data }) => {
        if (error)
          return (
            <>
              <b>ERROR:</b> {error}
            </>
          );
        if (!hideLoader && loading) return loader || <Loading />;
        return children(data);
      }}
    </Query>
  );
}
