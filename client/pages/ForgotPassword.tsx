import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { MagicEmailLinkForm } from "../components/MagicEmailLinkForm";

export function ForgotPassword() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <ContentContainer>
        <div className="flex flex-col md:flex-row gap-8 justify-around items-stretch w-full">
          <div className="md:w-5/12">
            <ForgotPasswordForm />
          </div>
          <div className="h-px w-full md:h-72 md:w-px bg-slate-200 self-center">&nbsp;</div>
          <div className="md:w-5/12">
            <MagicEmailLinkForm />
          </div>
        </div>
      </ContentContainer>
    </div>
  );
}
