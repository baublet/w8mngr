import React from "react";

import { ContentLayout } from "../components/Containers/ContentLayout";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { Form, Input } from "../components/Forms";
import { PrimaryButton } from "../components/Button/Primary";
import { Spacer } from "../components/Spacer";
import { useForm } from "../helpers";
import { useRegisterMutation, GetCurrentUserDocument } from "../generated";

export function Register() {
  const registerForm = useForm<{
    username: string;
    password: string;
    passwordConfirmation: string;
  }>();
  const [register, { loading }] = useRegisterMutation({
    refetchQueries: [GetCurrentUserDocument],
    onCompleted: () => {
      console.log("Registered");
    },
  });

  console.log(registerForm.getValues());

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
                focusOnFirstRender
              />
              <Spacer />
              <Input
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={registerForm.getHandler("password")}
              />
              <Spacer size="s" />
              <Input
                type="password"
                label="Password"
                placeholder="Confirmation"
                id="passwordConfirmation"
                onChange={registerForm.getHandler("passwordConfirmation")}
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
