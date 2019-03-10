import * as React from "react";
import readActivityQuery from "shared/queries/activities.read";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import ActivityForm from "client/components/Activity/ActivityForm";
import { Mutation, Query } from "react-apollo";
import updateActivityQuery from "shared/queries/activities.update";
import updateActivityOperation from "./operations/updateActivity";
import { History } from "history";
import { ActivityType } from "api/activities/types";

interface EditActivityPageProps {
  id: string;
  history: History;
}

export default function EditActivityPage(
  props: EditActivityPageProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading>Edit Activity</PageHeading>
      <ContentContainer>
        <Query
          query={readActivityQuery}
          variables={{ id: parseInt(props.id, 10) }}
        >
          {({ data: { activity } }) => {
            if (!activity) {
              return false;
            }
            return (
              <Mutation mutation={updateActivityQuery}>
                {updateActivityFn => (
                  <ActivityForm
                    saveLabel="Save Activity"
                    onSave={(activity: ActivityType) => {
                      updateActivityOperation(
                        activity.id,
                        activity.name,
                        activity.description,
                        activity.activity_type.toString(),
                        activity.muscle_groups,
                        props.history,
                        updateActivityFn
                      );
                    }}
                    {...activity}
                  />
                )}
              </Mutation>
            );
          }}
        </Query>
      </ContentContainer>
    </>
  );
}
