import * as React from "react";
import { RouteChildrenProps } from "react-router";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import ActivityForm, {
  ActivityFormState
} from "client/components/Activity/ActivityForm";
import { Mutation } from "react-apollo";
import createActivityQuery from "shared/queries/activities.create";
import createActivityOperation from "./operations/createActivity";

export default function NewActivityPage(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading>New Activity</PageHeading>
      <ContentContainer>
        <Mutation mutation={createActivityQuery}>
          {createActivityFn => (
            <ActivityForm
              saveLabel="Create Activity"
              onSave={(activity: ActivityFormState) => {
                createActivityOperation(
                  activity.name,
                  activity.description,
                  props.history,
                  createActivityFn
                );
              }}
            />
          )}
        </Mutation>
      </ContentContainer>
    </>
  );
}
