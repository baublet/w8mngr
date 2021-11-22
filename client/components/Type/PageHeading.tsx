import React from "react";
import cx from "classnames";

import { ContentContainer } from "../../components/Containers/ContentContainer";
import { Spacer } from "../Spacer";

interface PageHeadingProps {
  quickLinks?: React.ReactElement | false;
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
          <div className="absolute text-5xl text-gray-50 flex justify-center items-center rounded-full w-16 h-16 bg-green-400 text-center" style={{
            transform: "translate(-2em, .45em)"
          }}>{props.icon}</div>
        </div>
      )}
      <ContentContainer>
        <div className={cx("flex justify-between items-center block w-full")}>
          <h3
            className={cx(
              "mt-3 text-2xl font-thin text-gray-600 block w-full",
              props.className
            )}
          >
            {props.children}
          </h3>
          {!props.quickLinks ? false : <div>{props.quickLinks}</div>}
        </div>
        <Spacer size="s" />
      </ContentContainer>
    </>
  );
}
