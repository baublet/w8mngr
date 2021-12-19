import React from "react";
import cx from "classnames";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  content: string;
  maxLength?: number;
  textOnly?: boolean;
  className?: string;
}

export function MarkdownRenderer(
  props: MarkdownProps
): React.ReactComponentElement<any> {
  const text = React.useMemo(() => {
    if (!props.maxLength) {
      return props.content;
    }
    return (
      props.content.substring(0, props.maxLength) +
      (props.content.length > props.maxLength ? "... " : "")
    );
  }, [props.content]);

  const allowedElements = React.useMemo<string[]>(() => {
    return props.textOnly
      ? []
      : [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "b",
          "i",
          "em",
          "strong",
          "pre",
          "code",
          "blockquote",
          "ul",
          "ol",
          "li",
          "u",
          "br",
          "p",
          "a",
          "span",
          "div",
        ];
  }, [props.textOnly]);

  return (
    <div className={cx("md", props.className)}>
      <ReactMarkdown
        allowedElements={allowedElements}
        skipHtml={true}
        unwrapDisallowed={true}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
