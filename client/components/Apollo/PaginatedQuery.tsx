import * as React from "react";
import Loading from "client/components/Loading/Primary";

import { Query, QueryResult } from "react-apollo";
import { DocumentNode } from "graphql";

const defaultPerPage = 25;

type LoadMoreFn = () => void;
export type LoadMoreType = false | LoadMoreFn;

interface ApolloQueryProps {
  query: DocumentNode;
  prop: string;
  perPage?: number;
  variables?: any;
  children: (result: QueryResult, loadMore: LoadMoreType) => React.ReactNode;
  pollInterval?: number;
  ssr?: boolean;
  loading?: () => React.ReactNode | false;
}

function hasMoreToLoad(data, prop, limit) {
  if (!data) return false;
  if (!data[prop]) return false;
  if (data[prop].length < limit) return false;
  return true;
}

export default function ApolloPaginatedQuery(props: ApolloQueryProps) {
  const { children, loading: loader, ...queryProps } = props;

  const [moreResults, setMoreResults] = React.useState(true);

  queryProps.variables = Object.assign({}, queryProps.variables, {
    offset: 0,
    limit: props.perPage || defaultPerPage
  });

  return (
    <Query {...queryProps}>
      {({ loading, error, data, fetchMore }) => {
        if (error)
          return (
            <>
              <b>ERROR:</b> {error}
            </>
          );
        if (loading) return loader || <Loading />;
        const loadMore =
          !moreResults ||
          !hasMoreToLoad(data, props.prop, props.perPage || defaultPerPage)
            ? false
            : () => {
                fetchMore({
                  variables: {
                    offset: data[props.prop].length
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (
                      !fetchMoreResult ||
                      !fetchMoreResult[props.prop] ||
                      !fetchMoreResult[props.prop].length
                    ) {
                      setMoreResults(false);
                      return prev;
                    }
                    if (
                      fetchMoreResult[props.prop].length <
                      (props.perPage || defaultPerPage)
                    ) {
                      setMoreResults(false);
                    }
                    return Object.assign({}, prev, {
                      [props.prop]: [
                        ...prev[props.prop],
                        ...fetchMoreResult[props.prop]
                      ]
                    });
                  }
                });
              };
        return children(data, loadMore);
      }}
    </Query>
  );
}
