import React from "react";

import { ContentLayout } from "../components/Containers/ContentLayout";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { AsyncMarkdown } from "../components/Markdown";

export function TermsOfService() {
  return (
    <div>
      <PageHeading>Terms of Service</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <AsyncMarkdown
              content={`Terms and Conditions are rules which one must agree to abide by in order to use a service. If you do not agree to these terms and use our service, or violate any principle within them, your account may be terminated without notice, and without the ability to recover your data or account.

## Comportment

w8mngr.com provides several features that allows users to interact with one another. We do not allow any form of harassment or bullying, and users found in violation of these terms may be denied their ability to participate in the social functions of the website, barring an appeal.

What constitutes harassment or bullying will be subject to the discretion of the administrator or administrators. Bans may be lifted at the discretion of another administrator, provided any terms or conditions the original administrator set on the user before the ban could be lifted are met.

The lead developer, Ryan M. Poe, or whoever shall replace him as lead developer, shall have final say in any and all matters concerning improper user behavior such as harassment and bullying.

## Intellectual Property

w8mngr.com claims no rights to the data belonging to individual users, including images or words uploaded by particular users. By clicking submit, uploading photographs, or otherwise using w8mngr.com, users must be acting in good faith that the material they post is not subject to any international copyright or patents.`}
            />
          }
        />
      </ContentContainer>
    </div>
  );
}
