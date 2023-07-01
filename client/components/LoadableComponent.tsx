import React from "react";

import { PrimaryLoader } from "./Loading/Primary";

type LoadableComponentProps = {
  load: () => Promise<any>;
  loadingComponent?: React.ComponentType<any>;
};

export function _LoadableComponent<
  T extends LoadableComponentProps,
  TKey extends ReturnType<T["load"]> extends Promise<infer TModule>
    ? keyof TModule
    : never,
  TComponent = ReturnType<T["load"]> extends Promise<infer TModule>
    ? TModule[TKey]
    : never
>({
  load,
  loadingComponent = PrimaryLoader,
  component,
  props = {} as any,
}: T & {
  component?: TKey;
  props?: TComponent extends (props: infer TProps) => any ? TProps : never;
}) {
  const [Component, setComponent] = React.useState<
    (() => JSX.Element) | undefined
  >();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    load()
      .then((module) => {
        const moduleComponent = module[component];
        if (!moduleComponent) {
          throw new Error(
            `Could not find component ${component} in module ${module}`
          );
        }
        setComponent(() => moduleComponent);
        setLoading(false);
      })
      .catch((reason) => {
        console.error(reason);
        if (
          reason?.message.includes(
            "Failed to fetch dynamically imported module"
          )
        ) {
          console.log("New version of w8mngr detected! Reloading...");
          window.location.reload();
        }
      });
  }, []);

  if (loading) {
    const LoadingComponent = loadingComponent;
    return <LoadingComponent />;
  }

  if (!Component) {
    return null;
  }

  return <Component {...(props as any)} />;
}

type LoadableRouteProps = LoadableComponentProps & {
  exact?: boolean;
};

export function LoadableComponent<
  T extends LoadableRouteProps,
  TKey extends ReturnType<T["load"]> extends Promise<infer TModule>
    ? keyof TModule
    : never
>({
  load,
  component,
  props,
}: T & {
  component?: TKey;
  props?: T[TKey] extends (props: infer TProps) => any ? TProps : never;
}) {
  return (
    <_LoadableComponent
      load={load}
      component={component as any}
      props={props as any}
    />
  );
}
