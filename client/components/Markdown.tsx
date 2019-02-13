import * as React from "react";
//@ts-ignore
import Markdown from "markdown-to-jsx";

interface MarkdownProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer(
  props: MarkdownProps
): React.ReactComponentElement<any> {
  return (
    <div className={`longForm ${props.className || ""}`}>
      <Markdown children={props.content} />
    </div>
  );
}
