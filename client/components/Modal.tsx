import React from "react";
import ReactDOM from "react-dom";
import cx from "classnames";

import { DeleteIconButton } from "./Button/DeleteIconButton";

export function Modal({
  children = null,
  open = false,
  closeFunction,
  heading,
}: React.PropsWithChildren<{
  open?: boolean;
  closeFunction: () => void;
  heading?: React.ReactNode;
}>) {
  const modalRootElement = React.useMemo(
    () => document.getElementById("modalRoot"),
    []
  );
  const bodyElement = React.useMemo(() => document.body, []);

  const closeHandler = React.useCallback(() => {
    closeFunction();
  }, []);

  React.useEffect(() => {
    if (!bodyElement || !modalRootElement) {
      return;
    }

    if (!open) {
      bodyElement.classList.remove("modal-open");
      if (!modalRootElement.classList.contains("hidden")) {
        modalRootElement.classList.add("hidden");
      }
    } else {
      bodyElement.classList.add("modal-open");
      modalRootElement.classList.remove("hidden");
    }
  }, [open]);

  if (!modalRootElement) {
    console.error("Modal root element not found");
    return null;
  }

  return ReactDOM.createPortal(
    <div
      onClick={closeHandler}
      className={cx(
        `pointer-events-auto bg-slate-800 bg-opacity-75 flex items-center justify-center p-8 sm:p-12 lg:p-16 h-full`,
        {
          "pointer-events-none -z-50 opacity-0": !open,
        }
      )}
    >
      <div
        className="bg-slate-50 p-8 shadow rounded-lg max-w-full flex flex-col gap-4 relative"
        style={{ width: "640px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <DeleteIconButton onClick={closeHandler} className="absolute top-4 right-4" />
        {heading && <h1 className="font-thin text-3xl">{heading}</h1>}
        {children}
      </div>
    </div>,
    modalRootElement
  );
}
