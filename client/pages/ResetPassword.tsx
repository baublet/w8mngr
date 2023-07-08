import React from "react";
import { useParams } from "react-router";

import { SecondaryButton } from "../components/Button/Secondary";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { Form, Input } from "../components/Forms";
import { Spacer } from "../components/Spacer";
import { PageHeading } from "../components/Type/PageHeading";
import { GetCurrentUserDocument, useResetPasswordMutation } from "../generated";
import { useForm } from "../helpers/useForm";
import { useToast } from "../helpers/useToast";
import { useNavigateToUrl } from "../helpers/useNavigateToUrl";

export function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigateToUrl();
  const formData = useForm<{
    password: string;
    passwordConfirmation: string;
  }>();
  const { error, success } = useToast();
  const [resetPassword, { loading }] = useResetPasswordMutation({
    refetchQueries: [GetCurrentUserDocument],
    onCompleted: () => {
      success("Password reset successful");
      navigate("/", { replace: true });
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
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading>Reset Password</PageHeading>
      </ContentContainer>
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
