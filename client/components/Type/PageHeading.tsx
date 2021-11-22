import React from "react";

import { ContentContainer } from "../../components/Containers/ContentContainer";
import { Spacer } from "../Spacer";

interface PageHeadingProps extends React.HTMLProps<HTMLInputElement> {
  quickLinks?: React.ReactComponentElement<any> | false;
}

export function PageHeading(
  props: PageHeadingProps
): React.ReactComponentElement<any> {
  return (
    <ContentContainer>
      <div className="flex justify-between items-center">
        <h3 className="my-3 text-3xl">{props.children}</h3>
        {!props.quickLinks ? false : <div>{props.quickLinks}</div>}
      </div>
      <Spacer />
    </ContentContainer>
  );
}
