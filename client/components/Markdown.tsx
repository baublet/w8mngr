import React from "react";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer(
  props: MarkdownProps
): React.ReactComponentElement<any> {
  return (
    <div className={`longForm ${props.className || ""}`}>{props.content}</div>
  );
}
