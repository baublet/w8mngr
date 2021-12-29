import React from "react";
import cx from "classnames";

import { GhostInvertedButton } from "../Button/GhostInverted";
import { Add } from "../Icons/Add";
import { CloseIcon } from "../Icons/Close";

function getDefaultFilterOpenState(): boolean {
  return window?.localStorage?.getItem("filterOpenState") !== "false";
}

export function FiltersPanel({ children }: React.PropsWithChildren<{}>) {
  const [open, setIsOpen] = React.useState(getDefaultFilterOpenState());

  const toggle = React.useCallback((e?: any) => {
    e?.preventDefault?.();
    setIsOpen((open) => {
      window?.localStorage?.setItem("filterOpenState", `${open}`);
      return !open;
    });
  }, []);

  return (
    <div className="p-2 text-xs w-full border border-slate-300 flex flex-col gap-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h3
          className="uppercase font-thin text-slate-600 w-full"
          onClick={toggle}
        >
          Filters
        </h3>
        <div>
          <GhostInvertedButton onClick={toggle}>
            {open ? <CloseIcon /> : <Add />}
          </GhostInvertedButton>
        </div>
      </div>
      <div className={cx({ block: open, hidden: !open })}>{children}</div>
    </div>
  );
}
