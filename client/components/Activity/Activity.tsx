import * as React from "react";
import { ActivityType } from "api/activities/types";
import Panel from "client/components/Containers/Panel";
import ItemHeading from "../Type/ItemHeading";
import TransparentIconButton from "../Button/TransparentIcon";
import EditIcon from "../Icons/Edit";
import activityTypeToString from "shared/transformers/activity/typeToString";
import MuscleGroups from "./MuscleGroups";

export interface ActivityComponentType extends ActivityType {
  index: number;
}

export default function ActivityComponent(
  props: ActivityComponentType
): React.ReactComponentElement<any> {
  const activityType = activityTypeToString(props.activity_type);
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
      <p className="opacity-50 text-xs">{activityType}</p>
      {!parseInt(props.muscle_groups, 10) ? (
        false
      ) : (
        <MuscleGroups selectedGroups={props.muscle_groups} />
      )}
    </Panel>
  );
}
