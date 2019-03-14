import * as React from "react";

// TODO: Don't import this if I publish this as an NPM module.
// Show nothing if no loader is passed in.
import Loading from "client/components/Loading/Primary";

import { Query, QueryResult } from "react-apollo";
import { DocumentNode } from "graphql";

const defaultPerPage = 2;

type LoadMoreFn = () => void;
export type LoadMoreType = false | LoadMoreFn;

interface ApolloQueryProps {
  query: DocumentNode;
  // TODO: Don't require this.
  // Most Apollo query data returns a single child node.
  // We should be checking for a single child node, and
  // defaulting to that, rather than requiring a prop.
  prop?: string;
  perPage?: number;
  variables?: any;
  children: (result: QueryResult, loadMore: LoadMoreType) => React.ReactNode;
  pollInterval?: number;
  ssr?: boolean;
  loading?: () => React.ReactNode | false;
}

function hasMoreToLoad(data: any, prop: string, limit: number): boolean {
  if (!data) return false;
  if (!data[prop]) return false;
  if (data[prop].length < limit) return false;
  return true;
}

export default function ApolloPaginatedQuery(props: ApolloQueryProps) {
  const { children, loading: loader, ...queryProps } = props;

  const [moreResults, setMoreResults] = React.useState(true);

  // TODO: support cursor method of pagination? (Only if I publish this.)
  // Would require a prop to set it, but shouldn't be a huge deal.
  queryProps.variables = Object.assign({}, queryProps.variables, {
    offset: 0,
    limit: props.perPage || defaultPerPage
  });

  return (
    <Query {...queryProps}>
      {({ loading, error, data, fetchMore }) => {
        const prop: string = props.prop || Object.keys(data)[0];

        console.log(loading, error, prop, data);

        if (error)
          // TODO: Allow custom error handling in component props
          return (
            <>
              <b>ERROR:</b> {error}
            </>
          );

        if (loading) return loader || <Loading />;

        const loadMore =
          !moreResults ||
          !hasMoreToLoad(data, prop, props.perPage || defaultPerPage)
            ? false
            : () => {
                console.log("Has more to load");
                fetchMore({
                  variables: {
                    offset: data[prop].length
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    console.log("We have called the update query");
                    if (
                      !fetchMoreResult ||
                      !fetchMoreResult[prop] ||
                      !fetchMoreResult[prop].length
                    ) {
                      setMoreResults(false);
                      return prev;
                    }
                    if (
                      fetchMoreResult[prop].length <
                      (props.perPage || defaultPerPage)
                    ) {
                      setMoreResults(false);
                    }
                    return Object.assign({}, prev, {
                      [prop]: [...prev[prop], ...fetchMoreResult[prop]]
                    });
                  }
                });
              };
        return children(data, loadMore);
      }}
    </Query>
  );
}
