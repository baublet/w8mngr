import * as React from "react";
import { ActivityType } from "api/activities/types";
import Panel from "client/components/Containers/Panel";

export interface ActivityComponentType extends ActivityType {
  index: number;
}

export default function ActivityComponent(
  props: ActivityComponentType
): React.ReactComponentElement<any> {
  return (
    <Panel className={!props.index ? "" : `mt-3`}>
      <p>{props.name}</p>
    </Panel>
  );
}
