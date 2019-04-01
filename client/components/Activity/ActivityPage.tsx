import * as React from "react";
import Query from "client/components/Apollo/Query";
import readActivityQuery from "shared/queries/activities.read";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import DayNavigator from "../DayNavigator/DayNavigator";

interface ActivityPageProps {
  id: string;
}

export default function ActivityPage(
  props: ActivityPageProps
): React.ReactComponentElement<any> {
  return (
    <Query query={readActivityQuery} variables={{ id: parseInt(props.id, 10) }}>
      {(props: any) => {
        console.log(props);
        if (!props.activity) {
          return false;
        }
        return (
          <>
            <PageHeading>{props.activity.name}</PageHeading>
            <ContentContainer>Test</ContentContainer>
          </>
        );
      }}
    </Query>
  );
}
