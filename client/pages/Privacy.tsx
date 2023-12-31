import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { AsyncMarkdown } from "../components/Markdown";
import { PageHeading } from "../components/Type/PageHeading";

export function Privacy() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading>Privacy Policy</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <AsyncMarkdown
              content={`We can be reached via e-mail at [baublet@gmail.com](mailto:baublet@gmail.com). Never hesitate to ask questions regarding your privacy. Net neutrality and your privacy are extremely important to us.

*tl;dr:* Your data is your data. We don't sell it. We don't track you. We don't use third-party ads, services, or cookies. Changing any of this requires six months of notice.

### Major amendments

Amending this document may proceed along one of the following tracks:

1. Minor amendments, clarifications, wording, typos: these can change without notice provided the changes are inconsequential to previous meanings.
2. Expansion of user rights and privacies: these may be added to establish certain rights not yet added to this document without notice. Our users don't need to be told that there's a new nefarious use of their data that we won't be doing.
3. Contraction of user rights and privacies: changes of this magnitude require six months of notice. If our business relies on a change of this magnitude, we have probably failed.

Notice in this section or any part of this document mean contacting each user by the email address associated with their account. Six months consists of six calendar months from the proposed change (e.g., January 3 notice or  a June 3 effective date). The email must consist of both the old version of this document and the new proposed document, with a summary of the major differences.

### Data Collected

We only keep information volunteered by the consumer, such as survey information, site registrations, and user health information.

User profile and health data is only available to the user who enters it. No data will ever be sold or disclosed to any agency (private or public) for any reason whatsoever.

If you are an agency looking for aggregate health data, please look elsewhere.

### Cookies

We use cookies to store visitors preferences and record session information.

w8mngr.com does not use any ad-related or tracking cookies apart from a session cookie when (and only when) logged in.

### Advertising

w8mngr.com has no plans to implement any form of advertising. If we change this, we will provide no fewer than six months of notice to our users before the change takes effect.

### Disclaimer

From time to time, we may use customer information for new, unanticipated uses not previously disclosed in our privacy notice. If our information practices change at some time in the future we will contact you before we use your data for any new purposes to notify you of the policy change and to provide you with the ability to opt out of these new uses.

We offer visitors the ability to have factual inaccuracies corrected in information that we maintain about them via the tools they used to enter that data in the first place. Most relevant data can be changed in profile options, which are not made available to the public or any third-parties.

### Grievances

If you feel that this site is not following its stated information policy, you may contact us or third-party enforcement agencies:

- The DMA's Committee on Ethical Business Practices at [mgoldberger@the-dma.org](mailto:mgoldberger@the-dma.org)
- State or local consumer protection office
- The Federal Trade Commission by phone at 202.FTC-HELP (202.382.4357) or electronically at [ftc.gov/ftc/complaint.htm](http://ftc.gov/ftc/complaint.htm)`}
            />
          }
        />
      </ContentContainer>
    </div>
  );
}
