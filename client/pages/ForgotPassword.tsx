import React from "react";
import { useHistory } from "react-router-dom";

import { useForm, useToast } from "../helpers";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { useRequestPasswordResetTokenMutation } from "../generated";
import { Spacer } from "../components/Spacer";
import { Form, Input } from "../components/Forms";
import { PrimaryButton } from "../components/Button/Primary";
import { SecondaryButton } from "../components/Button/Secondary";

export function ForgotPassword() {
  const formData = useForm<{ email: string }>();
  const { error, success } = useToast();
  const [sent, setSent] = React.useState(false);
  const [requestResetLink, { loading }] = useRequestPasswordResetTokenMutation({
    onError: error,
    onCompleted: () => {
      success("Check your email for a reset link");
      setSent(true);
    },
  });

  const submit = React.useCallback(() => {
    requestResetLink({
      variables: {
        email: formData.getValue("email"),
      },
    });
  }, []);

  return (
    <div>
      <PageHeading>Forgot Password</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={
            !sent ? (
              <Form
                loading={loading}
                onSubmit={submit}
                className="flex flex-col gap-4 max-w-md"
              >
                <Input
                  type="text"
                  label="Email"
                  placeholder="Email"
                  value={formData.getValue("email")}
                  onChange={formData.getHandler("email")}
                />
                <SecondaryButton size="lg" type="submit" full>
                  Reset Password
                </SecondaryButton>
              </Form>
            ) : (
              <div className="text-xl max-w-md bg-emerald-50 border border-emerald-200 p-4 rounded">
                If there's an account associated with
                <b> {formData.getValue("email")}</b>, we will email it with a
                link to reset the account's password. Don't forget to check your
                spam folder!
              </div>
            )
          }
        />
      </ContentContainer>
    </div>
  );
}
