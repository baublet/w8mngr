import React from "react";
import { useHistory } from "react-router";

import { ContentLayout } from "../components/Containers/ContentLayout";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { Form, Input } from "../components/Forms";
import { PrimaryButton } from "../components/Button/Primary";
import { Spacer } from "../components/Spacer";
import { useForm, useToast } from "../helpers";
import { useRegisterMutation, GetCurrentUserDocument } from "../generated";

export function Register() {
  const { replace } = useHistory();
  const registerForm = useForm<{
    username: string;
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

  return (
    <div>
      <PageHeading>Register</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <Form loading={loading}>
              <Input
                type="text"
                label="Username"
                placeholder="your@email.address"
                id="username"
                onChange={registerForm.getHandler("username")}
                value={registerForm.getValue("username")}
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
              <PrimaryButton
                type="submit"
                onClick={() =>
                  register({
                    variables: {
                      input: registerForm.getValues(),
                    },
                  })
                }
              >
                Register
              </PrimaryButton>
            </Form>
          }
        />
      </ContentContainer>
    </div>
  );
}
