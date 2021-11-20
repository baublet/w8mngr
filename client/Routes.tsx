import React from "react";
import { createBrowserHistory } from "history";

import { PrimaryLoader } from "./components/Loading/Primary";

const history = createBrowserHistory();
export { history };

export function Routes({ location }: any): React.ReactComponentElement<any> {
  return (
    <React.Suspense fallback={<PrimaryLoader />}>
      <b>Hello world</b>
    </React.Suspense>
  );
}
