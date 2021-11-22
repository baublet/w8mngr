import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { Form, Input } from "../components/Forms";
import { PrimaryButton } from "../components/Button/Primary";
import { Spacer } from "../components/Spacer";
import { useForm } from "../helpers";

export function Register() {
  const registerForm = useForm<{
    username: string;
    password: string;
    passwordConfirmation: string;
  }>();

  console.log(registerForm.getValues());

  return (
    <>
      <PageHeading>Register</PageHeading>
      <ContentContainer>
        <Form>
          <Input
            type="text"
            label="username"
            placeholder="your@email.address"
            id="username"
            onChange={registerForm.getHandler("username")}
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
            label="password"
            placeholder="Confirmation"
            id="passwordConfirmation"
            onChange={registerForm.getHandler("passwordConfirmation")}
          />
          <Spacer />
          <PrimaryButton
            type="submit"
            onClick={() => console.log(registerForm.getValues)}
          >
            Register
          </PrimaryButton>
        </Form>
      </ContentContainer>
    </>
  );
}
