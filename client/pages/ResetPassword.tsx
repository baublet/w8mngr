import React from "react";
import { useHistory, useParams } from "react-router";

import { ContentLayout } from "../components/Containers/ContentLayout";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { Form, Input } from "../components/Forms";
import { SecondaryButton } from "../components/Button/Secondary";
import { Spacer } from "../components/Spacer";
import { useForm, useToast } from "../helpers";
import { useResetPasswordMutation, GetCurrentUserDocument } from "../generated";

export function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const { replace } = useHistory();
  const formData = useForm<{
    password: string;
    passwordConfirmation: string;
  }>();
  const { error, success } = useToast();
  const [resetPassword, { loading }] = useResetPasswordMutation({
    refetchQueries: [GetCurrentUserDocument],
    onCompleted: () => {
      success("Password reset successful");
      replace("/");
    },
    onError: error,
  });

  const submit = React.useCallback(() => {
    if (loading) {
      return;
    }
    resetPassword({
      variables: {
        input: {
          ...formData.getValues(),
          resetToken: token,
        },
      },
    });
  }, [loading]);

  return (
    <div>
      <PageHeading>Reset Password</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <Form loading={loading} onSubmit={submit} className="max-w-md">
              <Input
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={formData.getHandler("password")}
                value={formData.getValue("password")}
              />
              <Spacer size="s" />
              <Input
                type="password"
                label="Password"
                placeholder="Confirmation"
                id="passwordConfirmation"
                onChange={formData.getHandler("passwordConfirmation")}
                value={formData.getValue("passwordConfirmation")}
                labelPlacement="bottom"
              />
              <Spacer />
              <input
                type="submit"
                value="Reset Password"
                className="screen-reader-text"
              />
              <SecondaryButton onClick={submit} disabled={loading} size="lg">
                Reset Password
              </SecondaryButton>
            </Form>
          }
        />
      </ContentContainer>
    </div>
  );
}
