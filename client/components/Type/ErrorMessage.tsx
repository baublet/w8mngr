import React from "react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage(
  props: ErrorMessageProps
) {
  return (
    <div className="text-sm">
      <b>Error:</b> {props.message}
    </div>
  );
}
