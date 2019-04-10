import * as React from "react";
import Query from "client/components/Apollo/Query";
import readActivityQuery from "shared/queries/activities.read";
import ContentContainer from "client/components/Containers/ContentContainer";
import DayNavigator from "../DayNavigator/DayNavigator";
import PanelInverted from "../Containers/PanelInverted";
import shortDate from "shared/helpers/date/shortDate";
import calcYesterday from "shared/helpers/date/yesterday";
import calcTomorrow from "shared/helpers/date/tomorrow";
import PanelHeading from "../Type/PanelHeading";
import ActivityEntries from "./ActivityEntries";
import NewActivityEntryForm from "./NewActivityEntry";
import Panel from "../Containers/Panel";
import { ActivityType } from "api/activities/types";

const get = require("lodash.get");

interface ActivityPageProps {
  id: string;
}

export default function ActivityPage(
  props: ActivityPageProps
): React.ReactComponentElement<any> {
  const today = parseInt(
    get(props, ["match", "params", "day"], shortDate()),
    10
  );

  const [day, setDay]: [number, React.Dispatch<number>] = React.useState(today),
    yesterday = calcYesterday(day),
    tomorrow = calcTomorrow(day);

  const onToday = () => setDay(shortDate()),
    onYesterday = () => setDay(yesterday),
    onTomorrow = () => setDay(tomorrow);

  return (
    <Query
      query={readActivityQuery}
      variables={{ id: parseInt(props.id, 10) }}
      pollInterval={360000}
    >
      {(props: any) => {
        if (!props.activity) {
          return false;
        }
        const activity: ActivityType = props.activity;
        return (
          <>
            <DayNavigator
              day={day}
              onToday={onToday}
              onTomorrow={onTomorrow}
              onYesterday={onYesterday}
            />
            <ContentContainer>
              <ActivityEntries
                activityId={activity.id}
                activityType={activity.activity_type}
                day={day}
              />
              <PanelInverted className="mt-3">
                <NewActivityEntryForm
                  day={day}
                  activityId={activity.id}
                  activityType={activity.activity_type}
                />
              </PanelInverted>
              <Panel className="mt-3">
                <PanelHeading>{props.activity.name}</PanelHeading>
                {!activity.description ? (
                  false
                ) : (
                  <div>{activity.description}</div>
                )}
              </Panel>
            </ContentContainer>
          </>
        );
      }}
    </Query>
  );
}
