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
              content={`We can be reached via e-mail from our contact form. Never hesitate to ask questions regarding your privacy. Net neutrality and your privacy are extremely important to us.

### Data Collected

For each visitor to our web page, our web server automatically recognizes only the consumer's domain name, but not the e-mail address (where possible). We collect only the domain name, but not the e-mail address of visitors to our web page, and information volunteered by the consumer, such as survey information, site registrations, and user health information.

User profile and health data is only available to the users who enter it. No data will ever be sold or disclosed to any agency (private or public) for any reason whatsoever.

If you are an agency looking for aggregate health data, please look elsewhere.

### Cookies

We use cookies to store visitors preferences and record session information.

Third-party ad servers or ad networks use technology to serve the advertisements and links that appear on w8mngr.com. They automatically receive your IP address when this occurs. Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by the third-party ad networks to measure the effectiveness of their advertisements and/or to personalize the advertising content that you see.

w8mngr.com has no access to or control over these cookies that are used by third-party advertisers.

### Advertising

w8mngr.com has no plans to implement any form of advertising.

### Disclaimer

From time to time, we may use customer information for new, unanticipated uses not previously disclosed in our privacy notice. If our information practices change at some time in the future we will contact you before we use your data for any new purposes to notify you of the policy change and to provide you with the ability to opt out of these new uses.

Upon request we provide site visitors with access to a description of information that we maintain about them. Consumers can access this information by our contact form.

We offer visitors the ability to have factual inaccuracies corrected in information that we maintain about them via the tools they used to enter that data in the first place. Most relevant data can be changed in profile options, which are not made available to the public or any third-parties.

### Grievances
If you feel that this site is not following its stated information policy, you may contact us or third-party enforcement agencies:

- The DMA's Committee on Ethical Business Practices at mgoldberger@the-dma.org
- State or local chapters of the Better Business Bureau
- State or local consumer protection office
- The Federal Trade Commission by phone at 202.FTC-HELP (202.382.4357) or electronically at [ftc.gov/ftc/complaint.htm](http://ftc.gov/ftc/complaint.htm)`}
            />
          }
        />
      </ContentContainer>
    </div>
  );
}
