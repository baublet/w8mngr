import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import ContentContainer from "client/components/Containers/ContentContainer";
import PageHeading from "client/components/Type/PageHeading";

export default class Home extends React.Component<RouteComponentProps> {
  render() {
    return (
      <>
        <PageHeading>Home</PageHeading>
        <ContentContainer />
      </>
    );
  }
}
