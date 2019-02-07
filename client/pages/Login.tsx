import * as React from "react";
import Button from "components/Button/Primary";
import { withRouter } from "react-router-dom";
import { History } from "history";
import LoginPageValidationHandler from "pages/Login.validate";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import userSchema from "schema/user";

const LOGIN = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password) {
      user {
        email
      }
      token
    }
  }
`;

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

  const onChange = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setValues({
      ...values,
      [target.name]: target.value,
      error: ""
    });
  };

  const validate = LoginPageValidationHandler(setValues);

  return (
    <Mutation
      mutation={LOGIN}
      update={(cache, { data }) => {
        localStorage.setItem("token", data.login.token);
        cache.writeQuery({
          query: userSchema,
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
              console.log(values);
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={values.email}
              onChange={onChange}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
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
