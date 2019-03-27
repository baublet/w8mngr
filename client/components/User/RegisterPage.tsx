import * as React from "react";
import Button from "client/components/Button/Primary";
import { withRouter } from "react-router-dom";
import { History } from "history";
import RegisterPageValidationHandler from "client/components/User/Register.validate";
import { Mutation } from "react-apollo";
import userQuery from "shared/queries/user";
import registerQuery from "shared/queries/user.create";
import Input from "client/components/Forms/Input";
import ContentContainer from "../Containers/ContentContainer";

export interface RegisterPageState {
  email: string;
  password: string;
  confirm: string;
  error: string;
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
    confirm: "",
    error: ""
  };

  const [values, setValues] = React.useState(initialState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setValues({
      ...values,
      [target.name]: target.value,
      error: ""
    });
  };

  const validate = RegisterPageValidationHandler(setValues);

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
    />
  );

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
        <ContentContainer>
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
            {RegistrationInput("email", "email", "Email Address", 3)}
            {RegistrationInput("password", "password", "Password")}
            {RegistrationInput("password", "confirm", "Confirm Password")}
            <Button
              type="submit"
              disabled={values.email && values.error == "" ? false : true}
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
