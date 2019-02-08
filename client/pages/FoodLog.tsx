import * as React from "react";
import { Query } from "react-apollo";
import foodLogQuery from "queries/foodLog";
import shortDate from "sharedHelpers/date/shortDate";
import yesterday from "sharedHelpers/date/yesterday";
import tomorrow from "sharedHelpers/date/tomorrow";

const FoodLog = function(): React.ReactComponentElement<any> {
  return (
    <Query
      query={foodLogQuery}
      variables={{ days: [yesterday(), shortDate(), tomorrow()] }}
    >
      {({ client, loading, data }) => {
        console.log(data);
        return <b>Test</b>;
      }}
    </Query>
  );
};

export default FoodLog;
