import React from "react";
import cx from "classnames"

interface Props {
  loading?: boolean
}

export function Form({children, loading = false}: React.PropsWithChildren<Props>) {
  return (
    <form
      className={cx("block p-6 -m-6", {
        ["bg-primary bg-opacity-5 pointer-none"]: loading
      })}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
