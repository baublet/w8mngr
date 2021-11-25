import React from "react";

type SideBarHeadingProps = React.PropsWithChildren<{}>;

export function SideBarHeading(props: SideBarHeadingProps) {
  return (
    <div className="font-bold text-green-800 text-opacity-50 text-sm">
      <h3>{props.children}</h3>
    </div>
  );
}
