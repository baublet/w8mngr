import * as React from "react";
import Query from "client/components/Apollo/Query";
import activitiesQuery from "shared/queries/activities";
import { RouteChildrenProps } from "react-router";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import ActivityForm, {
  ActivityFormState
} from "client/components/Activity/ActivityForm";

export default function NewActivityPage(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading>New Activity</PageHeading>
      <ContentContainer>
        <ActivityForm
          saveLabel="Create Activity"
          onSave={(activity: ActivityFormState) => {
            console.log(activity);
          }}
        />
      </ContentContainer>
    </>
  );
}
