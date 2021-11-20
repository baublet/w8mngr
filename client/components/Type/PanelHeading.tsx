import React from "react";

interface PageHeadingProps extends React.HTMLProps<HTMLInputElement> {
  quickLinks?: React.ReactComponentElement<any> | false;
}

export function PanelHeading(
  props: PageHeadingProps
): React.ReactComponentElement<any> {
  return (
    <div className="flex justify-between items-center">
      <h3>{props.children}</h3>
      {!props.quickLinks ? false : <div>{props.quickLinks}</div>}
    </div>
  );
}
