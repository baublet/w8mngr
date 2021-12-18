import React from "react";
import cx from "classnames";
import { Link, useHistory } from "react-router-dom";

import { ItemHeading } from "../Type/ItemHeading";
import { Input } from "../Forms";
import { SystemGhostIconButton } from "../Button/SystemGhostIcon";
import { Add } from "../Icons/Add";

import { SystemOutlineButton } from "../Button/SystemOutline";
import { GhostInvertedButton } from "../Button/GhostInverted";

export function ActivityListItem({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description?: string | null;
}) {
  const [showAll, setShowAll] = React.useState(false);

  return (
    <div
      className={`
hover:bg-gray-50
hover:bg-opacity-50
border
border-transparent
border-gray-100
hover:border-gray-100
rounded
p-4
    `}
    >
      <div
        className={`
flex
flex-col
w-full
`}
      >
        <Link
          to={`/activities/${id}`}
          className="flex w-full justify-start items-center text-left"
          title={`Edit Activity: ${name}`}
        >
          <div
            className={cx("flex w-full flex-col")}
          >
            <ItemHeading>{name}</ItemHeading>
            {description && (
              <div className="block mt-2 text-gray-700 text-opacity-80 leading-tight">
                {description.substr(0, 240)}
                {description.length > 240 ? "..." : ""}
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
