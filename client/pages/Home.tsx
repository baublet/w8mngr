import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export default class Home extends React.Component<RouteComponentProps> {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Query
          query={gql`
            {
              hello
            }
          `}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return <b>{data.hello}</b>;
          }}
        </Query>
      </div>
    );
  }
}
