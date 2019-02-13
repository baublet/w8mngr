import * as React from "react";
import ContentContainer from "components/Containers/ContentContainer";

export default function PageHeading(
  props: React.HTMLProps<HTMLInputElement>
): React.ReactComponentElement<any> {
  return (
    <ContentContainer>
      <h3 className="my-3">{props.children}</h3>
    </ContentContainer>
  );
}
