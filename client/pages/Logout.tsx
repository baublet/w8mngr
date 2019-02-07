import * as React from "react";
import Button from "components/Button/Primary";
import { Query } from "react-apollo";
import userSchema from "schema/user";
import { withRouter } from "react-router-dom";
import { History } from "history";

interface LogoutPageProps {
  history: History;
}

const logoutPage = ({ history }: LogoutPageProps) => {
  return (
    <div>
      <h1>Logout</h1>
      <p>Are you sure?</p>
      <Query query={userSchema}>
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
    </div>
  );
};

export default withRouter(logoutPage);
