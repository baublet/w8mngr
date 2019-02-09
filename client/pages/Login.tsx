import * as React from "react";
import Button from "components/Button/Primary";
import { withRouter } from "react-router-dom";
import { History } from "history";
import LoginPageValidationHandler from "pages/Login.validate";
import { Mutation } from "react-apollo";
import userQuery from "queries/user";
import loginQuery from "queries/login";
import Input from "components/Forms/Input";

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
          <h1>Log In</h1>
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
            <Button
              type="submit"
              disabled={values.email && values.error == "" ? false : true}
            >
              Log In
            </Button>
          </form>
        </>
      )}
    </Mutation>
  );
};

export default withRouter(LoginPage);
