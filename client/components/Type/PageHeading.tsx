import React from "react";
import cx from "classnames";

import { ContentContainer } from "../../components/Containers/ContentContainer";
import { Spacer } from "../Spacer";

interface PageHeadingProps {
  quickLinks?: React.ReactElement;
  children: React.ReactElement | string;
  className?: string;
  icon?: React.ReactElement;
}

export function PageHeading(
  props: PageHeadingProps
): React.ReactComponentElement<any> {
  return (
    <>
      {props.icon && (
        <div className="relative">
          <div
            className="absolute text-5xl text-gray-50 flex justify-center items-center rounded-bl-full rounded-tl-full w-16 h-16 bg-green-400 text-center"
            style={{
              transform: "translate(-2em, 0)",
            }}
          >
            {props.icon}
          </div>
        </div>
      )}
      <ContentContainer>
        <div className={cx("flex justify-between items-center block w-full")}>
          <h3
            className={cx(
              "text-2xl font-thin text-gray-600 block w-full",
              props.className
            )}
          >
            {props.children}
          </h3>
        </div>
        {!props.quickLinks ? (
          false
        ) : (
          <div className="mt-3">{props.quickLinks}</div>
        )}
        <Spacer size="s" />
      </ContentContainer>
    </>
  );
}
