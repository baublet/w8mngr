import React from "react";

type SideBarHeadingProps = React.PropsWithChildren<{}>;

export function SideBarHeading(props: SideBarHeadingProps) {
  return (
    <div className="w-full block font-bold text-green-800 text-opacity-50 text-sm pb-2 mb-2 border-b border-green-900 border-opacity-5">
      <h3>{props.children}</h3>
    </div>
  );
}
