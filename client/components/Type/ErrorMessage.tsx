import * as React from "react";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage(
  props: ErrorMessageProps
): React.ReactComponentElement<any> {
  return (
    <div className="text-sm">
      <b>Error:</b> {props.message}
    </div>
  );
}
