import React from "react";

export function useForm<T extends Record<string, any>>(
  initialValues?: Partial<T>
) {
  const formState = React.useMemo(() => new Map<keyof T, [keyof T]>(), []);
  const formHandlers = React.useMemo(() => {
    return new Map<keyof T, (data: T[keyof T]) => void>(initialValues as any);
  }, []);
  const [, uptickCounter] = React.useState(0);
  const render = React.useCallback(
    () => uptickCounter((value) => value + 1),
    []
  );

  return {
    getValues() {
      return Array.from(formState.keys()).reduce((copiedFormState, key) => {
        copiedFormState[key] = formState.get(key) as T[keyof T];
        return copiedFormState;
      }, {} as T);
    },
    getHandler<TElement extends keyof T>(element: TElement) {
      if (!formHandlers.has(element)) {
        formHandlers.set(element, (data) => {
          formState.set(element, data);
          render();
        });
      }
      return formHandlers.get(element) as (data: T[keyof T]) => void;
    },
  };
}
