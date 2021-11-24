import React from "react";

import { ItemHeading } from "../Type/ItemHeading";

export function FoodsListItem({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description?: string | null;
}) {
  return (
    <div className="flex w-full flex-col shadow rounded p-4">
      <div className="flex w-full">
        <ItemHeading>{name}</ItemHeading>
      </div>
    </div>
  );
}
