import React from "react";
import { useHistory } from "react-router-dom";

import { SecondaryButton } from "../components/Button/Secondary";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { Form, Input } from "../components/Forms";
import { LoginIcon } from "../components/Icons/Login";
import { Link } from "../components/Link";
import { PageHeading } from "../components/Type/PageHeading";
import { GetCurrentUserDocument, useLoginMutation } from "../generated";
import { useForm, useToast } from "../helpers";

export function Login() {
  const { push } = useHistory();
  const loginForm = useForm<{
    email: string;
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
    <div className="flex flex-col gap-2 w-full">
      <ContentContainer>
        <PageHeading icon={<LoginIcon />}>Login</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <Form
              loading={loading}
              onSubmit={submit}
              className="flex flex-col gap-4 max-w-md"
            >
              <Input
                type="text"
                placeholder="your@email.address"
                label="Email"
                onChange={loginForm.getHandler("email")}
                value={loginForm.getValue("email")}
                focusOnFirstRender
              />
              <Input
                type="password"
                placeholder="Password"
                label="Password"
                onChange={loginForm.getHandler("password")}
                value={loginForm.getValue("password")}
              />
              <div className="flex gap-4 items-center">
                <SecondaryButton onClick={submit} size="lg" disabled={loading}>
                  Login
                </SecondaryButton>
                <div className="text-sm">
                  <Link to="/forgot-password">forgot password</Link>
                </div>
              </div>
            </Form>
          }
        />
      </ContentContainer>
    </div>
  );
}
