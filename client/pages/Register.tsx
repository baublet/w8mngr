import React from "react";
import { useHistory } from "react-router";

import { SecondaryButton } from "../components/Button/Secondary";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { Form, Input } from "../components/Forms";
import { RegisterIcon } from "../components/Icons/Register";
import { PageHeading } from "../components/Type/PageHeading";
import { GetCurrentUserDocument, useRegisterMutation } from "../generated";
import { useForm, useToast } from "../helpers";

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

  return (
    <div className="flex flex-col gap-2 w-full">
      <ContentContainer>
        <PageHeading icon={<RegisterIcon />}>Register</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <Form
              loading={loading}
              onSubmit={submit}
              className="max-w-md flex w-full flex-col gap-4"
            >
              <Input
                type="text"
                label="Email"
                placeholder="your@email.address"
                id="email"
                onChange={registerForm.getHandler("email")}
                value={registerForm.getValue("email")}
                focusOnFirstRender
              />
              <Input
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={registerForm.getHandler("password")}
                value={registerForm.getValue("password")}
                label="Password"
              />
              <Input
                type="password"
                placeholder="Confirm password"
                id="passwordConfirmation"
                onChange={registerForm.getHandler("passwordConfirmation")}
                value={registerForm.getValue("passwordConfirmation")}
                showLabel={false}
              />
              <div>
                <input
                  type="submit"
                  value="Register"
                  className="screen-reader-text"
                />
                <SecondaryButton
                  onClick={submit}
                  disabled={loading}
                  size="lg"
                  leftIcon={
                    <div className="translate-y-1">
                      <RegisterIcon />
                    </div>
                  }
                >
                  Register
                </SecondaryButton>
              </div>
            </Form>
          }
        />
      </ContentContainer>
    </div>
  );
}
