import React from "react";
import { Route } from "react-router-dom";

import { PrimaryLoader } from "./Loading/Primary";

type LoadableComponentProps = {
  load: () => Promise<any>;
  loadingComponent?: React.ComponentType<any>;
};

export function LoadableComponent<T extends LoadableComponentProps>({
  load,
  component,
  loadingComponent = PrimaryLoader,
}: T & {
  component?: ReturnType<T["load"]> extends Promise<infer TModule>
    ? keyof TModule
    : never;
}) {
  const [Component, setComponent] = React.useState<
    (() => JSX.Element) | undefined
  >();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    load().then((module) => {
      console.log({ module });
      const moduleComponent = module[component];
      if (!moduleComponent) {
        throw new Error(
          `Could not find component ${component} in module ${module}`
        );
      }
      setComponent(() => moduleComponent);
      setLoading(false);
    });
  }, []);

  if (loading) {
    const LoadingComponent = loadingComponent;
    return <LoadingComponent />;
  }

  if (!Component) {
    return null;
  }

  return <Component />;
}

type LoadableRouteProps = LoadableComponentProps & {
  path: string | string[];
  exact?: boolean;
};

export function LoadableRoute<T extends LoadableRouteProps>({
  path,
  load,
  exact = true,
  component,
}: T & {
  component?: ReturnType<T["load"]> extends Promise<infer TModule>
    ? keyof TModule
    : never;
}) {
  return (
    <Route
      path={path}
      exact={exact}
      render={() => (
        <LoadableComponent load={load} component={component as any} />
      )}
    />
  );
}
