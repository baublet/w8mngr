import React from "react";
import { useHistory } from "react-router-dom";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PrimaryLoader } from "../components/Loading/Primary";
import { PageHeading } from "../components/Type/PageHeading";
import { GetCurrentUserDocument, useLogoutMutation } from "../generated";

export function Logout() {
  const { push } = useHistory();

  const [logout] = useLogoutMutation({
    refetchQueries: [GetCurrentUserDocument],
    onCompleted: () => {
      setTimeout(() => {
        push("/");
      }, 500);
    },
  });

  React.useEffect(() => {
    logout();
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      <PageHeading className="text-center">Logging out...</PageHeading>
      <ContentContainer>
        <div className="mx-auto">
          <PrimaryLoader />
          </div>
      </ContentContainer>
    </div>
  );
}
