import React from "react";
import { useHistory } from "react-router-dom";

import { useForm, useToast } from "../helpers";
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
  const { error } = useToast();

  const [login, { loading }] = useLoginMutation({
    variables: {
      input: loginForm.getValues(),
    },
    refetchQueries: [GetCurrentUserDocument],
    onCompleted: () => push("/"),
    onError: error,
  });

  const submit = React.useCallback(() => {
    login({
      variables: {
        input: loginForm.getValues(),
      },
    });
  }, []);

  return (
    <div>
      <PageHeading>Login</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <Form loading={loading} onSubmit={submit}>
              <Input
                type="text"
                placeholder="your@email.address"
                label="Username"
                onChange={loginForm.getHandler("username")}
                value={loginForm.getValue("username")}
                focusOnFirstRender
                labelPlacement="bottom"
              />
              <Input
                type="password"
                placeholder="Password"
                label="Password"
                onChange={loginForm.getHandler("password")}
                value={loginForm.getValue("password")}
                labelPlacement="bottom"
              />
              <Spacer size="s" />
              <PrimaryButton onClick={submit}>Login</PrimaryButton>
            </Form>
          }
        />
      </ContentContainer>
    </div>
  );
}
