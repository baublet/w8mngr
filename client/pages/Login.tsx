import React from "react";
import { useHistory } from "react-router-dom";

import { useForm } from "../helpers";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { useLoginMutation, GetCurrentUserDocument } from "../generated";
import { Spacer } from "../components/Spacer";
import { Form, Input } from "../components/Forms";
import { PrimaryButton } from "../components/Button/Primary";

export function Login() {
  const { push } = useHistory();
  const loginForm = useForm<{
    username: string;
    password: string;
  }>();

  const [login, { loading }] = useLoginMutation({
    variables: {
      input: loginForm.getValues(),
    },
    refetchQueries: [GetCurrentUserDocument],
    onCompleted: () => push("/"),
  });

  return (
    <div>
      <PageHeading>Login</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <Form loading={loading}>
              <Input
                type="text"
                placeholder="your@email.address"
                label="Username"
                onChange={loginForm.getHandler("username")}
                focusOnFirstRender
              />
              <Spacer size="s" />
              <Input
                type="password"
                placeholder="Password"
                label="Password"
                onChange={loginForm.getHandler("password")}
              />
              <Spacer />
              <PrimaryButton
                onClick={() => {
                  login({
                    variables: {
                      input: loginForm.getValues(),
                    },
                  });
                }}
              >
                Login
              </PrimaryButton>
            </Form>
          }
        />
      </ContentContainer>
    </div>
  );
}
