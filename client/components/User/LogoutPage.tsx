import * as React from "react";
import Button from "client/components/Button/Primary";
import { Query } from "react-apollo";
import userQuery from "shared/queries/user";
import { withRouter } from "react-router-dom";
import { History } from "history";
import ContentContainer from "../Containers/ContentContainer";
import PageHeading from "../Type/PageHeading";

interface LogoutPageProps {
  history: History;
}

const logoutPage = ({ history }: LogoutPageProps) => {
  return (
    <>
      <PageHeading>Logout</PageHeading>
      <ContentContainer>
        <p>Are you sure?</p>
        <Query query={userQuery}>
          {({ client, loading, data }) => (
            <Button
              onClick={() => {
                if (localStorage) {
                  localStorage.removeItem("token");
                  client.resetStore();
                  history.push("/");
                }
              }}
            >
              Logout
            </Button>
          )}
        </Query>
      </ContentContainer>
    </>
  );
};

export default withRouter(logoutPage);
