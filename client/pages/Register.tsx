import * as React from "react";
import Button from "../components/Button/Primary";
import { withRouter } from "react-router-dom";
import { History } from "history";
import RegisterPageSubmissionHandler from "./Register.submit";

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

  const submit = RegisterPageSubmissionHandler(setValues, history);

  return (
    <div>
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
          submit(values);
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email address"
          value={values.email}
          onChange={onChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          name="password"
          value={values.password}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirm"
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
    </div>
  );
};

export default withRouter(RegisterPage);
