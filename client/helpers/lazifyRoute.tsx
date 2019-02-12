import * as React from "react";

export default function lazifyRoute(
  path: string
): React.LazyExoticComponent<any> {
  return React.lazy(() => {
    return Promise.all([
      import(`../${path}`),
      new Promise(resolve => setTimeout(resolve, 500))
    ]).then(([moduleExports]) => moduleExports);
  });
}
