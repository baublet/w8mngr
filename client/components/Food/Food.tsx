import * as React from "react";
import { FoodType } from "api/foods/types";
import Panel from "components/Containers/Panel";
import ItemHeading from "components/Type/ItemHeading";
import EditIcon from "components/Icons/Edit";
import TransparentIconButton from "components/Button/TransparentIcon";
import Markdown from "components/Markdown";

interface FoodDisplayType extends FoodType {
  index: number;
}

export default function Food(
  props: FoodDisplayType
): React.ReactComponentElement<any> {
  return (
    <Panel className={props.index == 0 ? "" : "mt-3"}>
      <TransparentIconButton className="absolute pin-r pin-t">
        <EditIcon />
        <span className="screen-reader-text">Edit Food</span>
      </TransparentIconButton>
      <ItemHeading>{props.name}</ItemHeading>
      {!props.description ? (
        false
      ) : (
        <Markdown content={props.description} className="mt-3" />
      )}
    </Panel>
  );
}
