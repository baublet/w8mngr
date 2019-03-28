import * as React from "react";
import Button from "client/components/Button/Primary";
import { withRouter } from "react-router-dom";
import { History } from "history";
import RegisterPageValidationHandler from "client/components/User/operations/validateCreate";
import { Mutation } from "react-apollo";
import registerQuery from "shared/queries/user.create";
import Input from "client/components/Forms/Input";
import ContentContainer from "../Containers/ContentContainer";
import registerAction from "./operations/create";
import { ApolloCache } from "apollo-cache";
import ErrorMessage from "../Type/ErrorMessage";

export interface RegisterPageState {
  email: string;
  password: string;
  confirm: string;
  [key: string]: string | number;
}

interface RegisterPageProps {
  history: History;
}

const RegisterPage = function({
  history
}: RegisterPageProps): React.ReactComponentElement<any> {
  const initialState: RegisterPageState = {
    email: "",
    password: "",
    confirm: ""
  };

  const [values, setValues] = React.useState(initialState);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const target = event.target as HTMLInputElement;
    setValues({
      ...values,
      [target.name]: target.value
    });
  };

  const validate = RegisterPageValidationHandler(setError, setErrorMessage);

  const RegistrationInput = (
    type: string,
    name: string,
    placeholder: string,
    minLength: number = 8
  ) => (
    <Input
      type={type}
      name={name}
      placeholder={placeholder}
      required
      value={values[name]}
      onChange={onChange}
      minLength={minLength}
      autoComplete="new-password"
    />
  );

  return (
    <Mutation
      mutation={registerQuery}
      update={(cache: ApolloCache<any>, { data }) => {
        registerAction(cache, data, history, setError, setErrorMessage);
      }}
    >
      {register => (
        <ContentContainer>
          <h1>Register</h1>
          {!error ? false : <ErrorMessage message={errorMessage} />}
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
            {RegistrationInput("email", "email", "Email Address", 3)}
            {RegistrationInput("password", "password", "Password")}
            {RegistrationInput("password", "confirm", "Confirm Password")}
            <Button
              type="submit"
              disabled={values.email && !error ? false : true}
            >
              Register
            </Button>
          </form>
        </ContentContainer>
      )}
    </Mutation>
  );
};

export default withRouter(RegisterPage);
