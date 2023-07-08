import React from "react";
import { useNavigate } from "react-router-dom";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { NotFound as NotFoundIcon } from "../components/Icons/NotFound";
import { Link } from "../components/Link";
import { Spacer } from "../components/Spacer";
import { PageHeading } from "../components/Type/PageHeading";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="text-center mt-10">
      <ContentContainer>
        <div className="text-9xl text-slate-500 inline-block">
          <NotFoundIcon />
        </div>
      </ContentContainer>
      <Spacer />
      <ContentContainer>
        <PageHeading className="text-center">404 Not Found</PageHeading>
      </ContentContainer>
      <div className="w-6/12 mx-auto mt-12 pt-12 max-w-half text-slate-600 border-t border-slate-100">
        We apologize for the inconvenience. Check the URL and make sure it's
        correct. Try to <Link onClick={() => navigate(-1)}>go back</Link> and
        see if the link is working, or <Link to="/">go back home</Link> and try
        searching for the resource.
      </div>
    </div>
  );
}
