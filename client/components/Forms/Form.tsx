import React from "react";
import cx from "classnames";

interface Props {
  loading?: boolean;
  onSubmit?: () => void;
}

export function Form({
  children,
  loading = false,
  onSubmit,
}: React.PropsWithChildren<Props>) {
  return (
    <form
      className={cx("block p-6 -m-6", {
        ["bg-primary bg-opacity-5 pointer-none"]: loading,
      })}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      {children}
      <div className="screen-reader-text">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
