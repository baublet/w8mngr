import React from "react";
import { useHistory } from "react-router-dom";

import { Link } from "../components/Link";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { NotFound as NotFoundIcon } from "../components/Icons/NotFound";
import { Spacer } from "../components/Spacer";

export function NotFound() {
  const { goBack } = useHistory();
  return (
    <div className="text-center mt-10">
      <ContentContainer>
        <div className="text-9xl text-slate-500 inline-block">
          <NotFoundIcon />
        </div>
      </ContentContainer>
      <Spacer />
      <PageHeading className="text-center">404 Not Found</PageHeading>
      <div className="w-6/12 mx-auto mt-12 pt-12 max-w-half text-slate-600 border-t border-slate-100">
        We apologize for the inconvenience. Check the URL and make sure it's
        correct. Try to <Link onClick={goBack}>go back</Link> and see if the
        link is working, or <Link to="/">go back home</Link> and try searching
        for the resource.
      </div>
    </div>
  );
}
