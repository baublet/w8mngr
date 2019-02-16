import * as React from "react";
import ContentContainer from "components/Containers/ContentContainer";
import { ReactComponentLike } from "prop-types";

interface PageHeadingProps extends React.HTMLProps<HTMLInputElement> {
  quickLinks?: React.ReactComponentElement<any> | false;
}

export default function PageHeading(
  props: PageHeadingProps
): React.ReactComponentElement<any> {
  return (
    <ContentContainer>
      <div className="flex justify-between items-center">
        <h3 className="my-3">{props.children}</h3>
        {!props.quickLinks ? false : <div>{props.quickLinks}</div>}
      </div>
    </ContentContainer>
  );
}
