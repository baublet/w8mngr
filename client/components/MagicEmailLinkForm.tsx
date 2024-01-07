import React from "react";

import { SecondaryButton } from "../components/Button/Secondary";
import { Form, Input } from "../components/Forms";
import { useRequestEmailLoginLinkMutation } from "../generated";
import { useForm } from "../helpers/useForm";
import { useToast } from "../helpers/useToast";
import { EmailIcon } from "./Icons/Email";
import { PageHeading } from "./Type/PageHeading";

export function MagicEmailLinkForm() {
  const formData = useForm<{ email: string }>();
  const { error, success } = useToast();
  const [sent, setSent] = React.useState(false);
  const [requestResetLink, { loading }] = useRequestEmailLoginLinkMutation({
    onError: error,
    onCompleted: (response) => {
      if (response.requestEmailLoginLink.errors.length > 0) {
        error(response.requestEmailLoginLink.errors[0]);
        setSent(false);
      } else {
        success("Check your email for your login link!");
        setSent(true);
      }
    },
  });

  const submit = React.useCallback(() => {
    requestResetLink({
      variables: {
        input: {
          email: formData.getValue("email"),
        },
      },
    });
  }, []);

  return !sent ? (
    <Form loading={loading} onSubmit={submit} className="flex flex-col gap-4">
      <PageHeading>Request Login Link</PageHeading>
      <p className="text-sm opacity-75">
        Tired of waiting? We can email you a one-click login link that takes you
        straight to your dashboard!
      </p>
      <Input
        type="text"
        label="Email"
        placeholder="Email"
        value={formData.getValue("email")}
        onChange={formData.getHandler("email")}
      />
      <div>
        <SecondaryButton
          size="lg"
          type="submit"
          disabled={loading}
          loading={loading}
          leftIcon={
            <div className="translate-y-px">
              <EmailIcon />
            </div>
          }
        >
          Get Login Link
        </SecondaryButton>
      </div>
    </Form>
  ) : (
    <div className="text-xl max-w-md bg-emerald-50 border border-emerald-200 p-4 rounded">
      If there's an account associated with
      <b> {formData.getValue("email")}</b>, we will email it with a link to
      login. Don't forget to check your spam folder!
    </div>
  );
}
