import React from "react";
import useLocation from "wouter/use-location";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PrimaryLoader } from "../components/Loading/Primary";
import { PageHeading } from "../components/Type/PageHeading";
import { GetCurrentUserDocument, useLogoutMutation } from "../generated";

export function Logout() {
  const [, navigate] = useLocation();

  const [logout] = useLogoutMutation({
    refetchQueries: [GetCurrentUserDocument],
    onCompleted: () => {
      setTimeout(() => {
        navigate("/");
      }, 500);
    },
  });

  React.useEffect(() => {
    logout();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading className="text-center">Logging out...</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <div className="mx-auto">
          <PrimaryLoader />
        </div>
      </ContentContainer>
    </div>
  );
}
