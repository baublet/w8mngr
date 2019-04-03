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
    <Query query={readActivityQuery} variables={{ id: parseInt(props.id, 10) }}>
      {(props: any) => {
        if (!props.activity) {
          return false;
        }
        return (
          <>
            <DayNavigator
              day={day}
              onToday={onToday}
              onTomorrow={onTomorrow}
              onYesterday={onYesterday}
            />
            <ContentContainer>
              <PanelInverted>
                <PanelHeading>{props.activity.name}</PanelHeading>
                {!props.activity.description ? (
                  false
                ) : (
                  <div>{props.activity.description}</div>
                )}
              </PanelInverted>
            </ContentContainer>
          </>
        );
      }}
    </Query>
  );
}
