import React from "react";
import cx from "classnames";

interface Props {
  loading?: boolean;
  onSubmit?: () => void;
  className?: string;
}

export function Form({
  children,
  loading = false,
  onSubmit,
  className,
}: React.PropsWithChildren<Props>) {
  return (
    <form
      className={cx(
        "block p-6 -m-6",
        {
          ["bg-white bg-opacity-10 pointer-events-none"]: loading,
        },
        className
      )}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      {children}
      <div className="screen-reader-text">
        <button type="submit" tabIndex={-1}>
          Submit
        </button>
      </div>
    </form>
  );
}
