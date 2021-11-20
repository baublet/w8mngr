import React from "react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage(
  props: ErrorMessageProps
): React.ReactComponentElement<any> {
  return (
    <div className="text-sm">
      <b>Error:</b> {props.message}
    </div>
  );
}
