import * as React from "react";
import Query from "components/Apollo/Query";
import activitiesQuery from "queries/activities";
import { RouteChildrenProps } from "react-router";
import PageHeading from "components/Type/PageHeading";
import ContentContainer from "components/Containers/ContentContainer";
import ActivityForm, {
  ActivityFormState
} from "components/Activity/ActivityForm";

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
