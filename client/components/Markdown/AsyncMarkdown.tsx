import React from "react";

import { LoadableComponent } from "../LoadableComponent";
import type { MarkdownProps } from "./Markdown";

export function AsyncMarkdown(props: MarkdownProps) {
  return (
    <LoadableComponent
      load={() => import("./Markdown")}
      component="MarkdownRenderer"
      props={props}
    />
  );
}
