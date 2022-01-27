import React from "react";

import { SecondaryButton } from "../components/Button/Secondary";
import { Form, Input } from "../components/Forms";
import { useRequestPasswordResetTokenMutation } from "../generated";
import { useForm, useToast } from "../helpers";
import { PageHeading } from "./Type/PageHeading";

export function ForgotPasswordForm() {
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

  return !sent ? (
    <Form
      loading={loading}
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <PageHeading>Request Password Reset Link</PageHeading>
      <p className="text-sm opacity-75">
        Need to reset your password? We can email you a one-click link to reset your password.
      </p>
      <Input
        type="text"
        label="Email"
        placeholder="Email"
        value={formData.getValue("email")}
        onChange={formData.getHandler("email")}
      />
      <div>
        <SecondaryButton size="lg" type="submit">
          Reset Password
        </SecondaryButton>
      </div>
    </Form>
  ) : (
    <div className="text-xl max-w-md bg-emerald-50 border border-emerald-200 p-4 rounded">
      If there's an account associated with
      <b> {formData.getValue("email")}</b>, we will email it with a link to
      reset the account's password. Don't forget to check your spam folder!
    </div>
  );
}
