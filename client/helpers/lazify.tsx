import * as React from "react";

export default function(path: string): React.LazyExoticComponent<any> {
  return React.lazy(() => {
    return Promise.all([
      import(`../${path}`),
      new Promise(resolve => setTimeout(resolve, 300))
    ]).then(([moduleExports]) => moduleExports);
  });
}
