import React from "react";
import { ObjectSchema } from "yup";

export function useForm<T extends Record<string, any>>({
  initialValues = {},
  schema,
}: {
  initialValues?: Partial<{ [K in keyof T]: any }>;
  schema?: ObjectSchema<any>;
} = {}) {
  const formState = React.useMemo(
    () => new Map<keyof T, [keyof T]>(Object.entries(initialValues) as any),
    []
  );
  const formHandlers = React.useMemo(() => {
    return new Map<keyof T, (data: T[keyof T]) => void>();
  }, []);
  const [, uptickCounter] = React.useState(0);
  const render = React.useCallback(
    () => uptickCounter((value) => value + 1),
    []
  );

  const clear = React.useCallback(() => {
    const keys = Array.from(formState.keys());
    for (const key of keys) {
      formState.delete(key);
    }
    render();
  }, []);

  const getValues = React.useCallback(() => {
    return Array.from(formState.keys()).reduce((copiedFormState, key) => {
      copiedFormState[key] = formState.get(key) as T[keyof T];
      return copiedFormState;
    }, {} as T);
  }, []);

  const getHandler = React.useCallback(
    <TElement extends keyof T>(element: TElement) => {
      if (!formHandlers.has(element)) {
        formHandlers.set(element, (data) => {
          formState.set(element, data);
          render();
        });
      }
      return formHandlers.get(element) as (data: T[keyof T]) => void;
    },
    []
  );

  const getValue = React.useCallback(
    <TElement extends keyof T>(element: TElement) => {
      return `${formState.get(element) || ""}`;
    },
    []
  );

  const getCastValues = React.useCallback(() => {
    if (!schema) {
      throw new Error(`Cannot cast values. No schema provided to useForm`);
    }
    return schema.cast(getValues(), { assert: false }) as T;
  }, []);

  return {
    clear,
    getValues,
    getHandler,
    getCastValues,
    getValue,
  };
}
