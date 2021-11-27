import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import { ItemHeading } from "../Type/ItemHeading";

export function FoodsListItem({
  id,
  name,
  description,
  previewImageUrl,
}: {
  id: string;
  name: string;
  description?: string | null;
  previewImageUrl?: string | null;
}) {
  return (
    <div
      className={`
flex
w-full
rounded
p-4
hover:bg-green-50
hover:bg-opacity-50
border
border-transparent
hover:border-green-100
`}
    >
      <Link
        to={`/foods/edit/${id}`}
        className="block flex w-full justify-start items-center text-left"
        title={`Edit Food: ${name}`}
      >
        {previewImageUrl && (
          <div>
            <img
              src={previewImageUrl}
              className="w-24 h-auth rounded"
              title={description || "Food preview"}
            />
          </div>
        )}
        <div
          className={cx("flex w-full flex-col", {
            "ml-4": previewImageUrl,
          })}
        >
          <ItemHeading>{name}</ItemHeading>
          {description && (
            <div className="block mt-2 text-gray-700 text-opacity-80">
              {description}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
