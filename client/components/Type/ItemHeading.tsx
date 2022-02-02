import React from "react";

export function ItemHeading(props: React.PropsWithChildren<{}>) {
  return (
    <h4 className="text-2xl font-thin normal-case text-slate-900 text-opacity-75 block leading-none">
      {props.children}
    </h4>
  );
}
