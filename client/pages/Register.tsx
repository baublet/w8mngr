import * as React from "react";
import Button from "components/Button/Primary";
import { withRouter } from "react-router-dom";
import { History } from "history";
import RegisterPageValidationHandler from "pages/Register.validate";
import { Mutation } from "react-apollo";
import userQuery from "queries/user";
import registerQuery from "queries/register";

export interface RegisterPageState {
  email: string;
  password: string;
  confirm: string;
  error: string;
}

interface RegisterPageProps {
  history: History;
}

const RegisterPage = function({
  history
}: RegisterPageProps): React.ReactComponentElement<any> {
  const [values, setValues] = React.useState({
    email: "",
    password: "",
    confirm: "",
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

  const validate = RegisterPageValidationHandler(setValues);

  return (
    <Mutation
      mutation={registerQuery}
      update={(cache, { data }) => {
        localStorage.setItem("token", data.register.token);
        cache.writeQuery({
          query: userQuery,
          data: { user: data.register.user }
        });
        history.push("/");
      }}
    >
      {register => (
        <>
          <h1>Register</h1>
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
                register({
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
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirm"
              required
              minLength={8}
              value={values.confirm}
              onChange={onChange}
            />
            <Button
              type="submit"
              disabled={values.email && values.error == "" ? false : true}
            >
              Register
            </Button>
          </form>
        </>
      )}
    </Mutation>
  );
};

export default withRouter(RegisterPage);
