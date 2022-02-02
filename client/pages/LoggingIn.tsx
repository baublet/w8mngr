import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PrimaryLoader } from "../components/Loading/Primary";
import { PageHeading } from "../components/Type/PageHeading";
import { useLoginWithToken } from "../helpers";

export function LoggingIn() {
  useLoginWithToken();
  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading className="text-center">Logging in...</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <div className="mx-auto">
          <PrimaryLoader />
        </div>
      </ContentContainer>
    </div>
  );
}
