import * as React from "react";
import { ActivityType } from "api/activities/types";
import Panel from "client/components/Containers/Panel";
import ItemHeading from "../Type/ItemHeading";
import TransparentIconButton from "../Button/TransparentIcon";
import EditIcon from "../Icons/Edit";

export interface ActivityComponentType extends ActivityType {
  index: number;
}

export default function ActivityComponent(
  props: ActivityComponentType
): React.ReactComponentElement<any> {
  return (
    <Panel className={!props.index ? "" : `mt-3`}>
      <TransparentIconButton
        className="absolute pin-r pin-t"
        to={`/activity/${props.id}/edit`}
      >
        <EditIcon />
        <span className="screen-reader-text">Edit Food</span>
      </TransparentIconButton>
      <ItemHeading>{props.name}</ItemHeading>
      {!props.description ? false : <p>{props.description}</p>}
    </Panel>
  );
}
