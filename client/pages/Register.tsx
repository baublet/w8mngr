import React from "react";
import { useHistory } from "react-router";

import { ContentLayout } from "../components/Containers/ContentLayout";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { Form, Input } from "../components/Forms";
import { SecondaryButton } from "../components/Button/Secondary";
import { Spacer } from "../components/Spacer";
import { useForm, useToast } from "../helpers";
import { useRegisterMutation, GetCurrentUserDocument } from "../generated";

export function Register() {
  const { replace } = useHistory();
  const registerForm = useForm<{
    email: string;
    password: string;
    passwordConfirmation: string;
  }>();
  const { error, success } = useToast();
  const [register, { loading }] = useRegisterMutation({
    refetchQueries: [GetCurrentUserDocument],
    onCompleted: () => {
      success("Successfully registered!");
      replace("/");
    },
    onError: error,
  });

  const submit = React.useCallback(() => {
    if (loading) {
      return;
    }
    register({
      variables: {
        input: registerForm.getValues(),
      },
    });
  }, [loading]);

  console.log({ loading });

  return (
    <div>
      <PageHeading>Register</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <Form loading={loading} onSubmit={submit}>
              <Input
                type="text"
                label="Email"
                placeholder="your@email.address"
                id="email"
                onChange={registerForm.getHandler("email")}
                value={registerForm.getValue("email")}
                focusOnFirstRender
                labelPlacement="bottom"
              />
              <Spacer size="s" />
              <Input
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={registerForm.getHandler("password")}
                value={registerForm.getValue("password")}
              />
              <Spacer size="s" />
              <Input
                type="password"
                label="Password"
                placeholder="Confirmation"
                id="passwordConfirmation"
                onChange={registerForm.getHandler("passwordConfirmation")}
                value={registerForm.getValue("passwordConfirmation")}
                labelPlacement="bottom"
              />
              <Spacer />
              <input
                type="submit"
                value="Register"
                className="screen-reader-text"
              />
              <SecondaryButton onClick={submit} disabled={loading} size="lg">
                Register
              </SecondaryButton>
            </Form>
          }
        />
      </ContentContainer>
    </div>
  );
}
