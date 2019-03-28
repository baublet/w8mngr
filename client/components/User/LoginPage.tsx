import * as React from "react";
import Button from "client/components/Button/Primary";
import { withRouter } from "react-router-dom";
import { History } from "history";
import LoginPageValidationHandler from "client/components/User/operations/validateLogin";
import { Mutation } from "react-apollo";
import userQuery from "shared/queries/user";
import loginQuery from "shared/queries/user.login";
import Input from "client/components/Forms/Input";
import PageHeading from "../Type/PageHeading";
import ContentContainer from "../Containers/ContentContainer";

export interface LoginPageState {
  email: string;
  password: string;
  error: string;
}

interface LoginPageProps {
  history: History;
}

const LoginPage = function({
  history
}: LoginPageProps): React.ReactComponentElement<any> {
  const [values, setValues] = React.useState({
    email: "",
    password: "",
    error: ""
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
      error: ""
    });
  };

  const validate = LoginPageValidationHandler(setValues);

  return (
    <Mutation
      mutation={loginQuery}
      update={(cache, { data }) => {
        localStorage.setItem("token", data.login.token);
        cache.writeQuery({
          query: userQuery,
          data: { user: data.login.user }
        });
        history.push("/");
      }}
    >
      {login => (
        <>
          <PageHeading>Log In</PageHeading>
          <ContentContainer>
            {!values.error ? (
              false
            ) : (
              <div>
                <b>Error: </b> {values.error}
              </div>
            )}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (validate(values)) {
                  login({
                    variables: {
                      email: values.email,
                      password: values.password
                    }
                  });
                }
              }}
            >
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="Email address"
                required
                value={values.email}
                onChange={onChange}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Password"
                name="password"
                required
                minLength={8}
                value={values.password}
                onChange={onChange}
              />
              <div className="mt-3">
                <Button
                  type="submit"
                  disabled={values.email && values.error == "" ? false : true}
                >
                  Log In
                </Button>
              </div>
            </form>
          </ContentContainer>
        </>
      )}
    </Mutation>
  );
};

export default withRouter(LoginPage);
