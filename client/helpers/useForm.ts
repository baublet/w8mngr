import { useState } from "react";

type ValuesType = object;

export interface UseFormType {
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  values: ValuesType;
}

export type UseFormCallback = (values: ValuesType) => void;

export function useForm(
  callback: UseFormCallback,
  initialValues: ValuesType
): UseFormType {
  const [values, setValues] = useState(initialValues);

  const handleSubmit = (event: React.FormEvent) => {
    if (event) event.preventDefault();
    callback(values);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.currentTarget.name]: event.currentTarget.value
    }));
  };

  return {
    handleChange,
    handleSubmit,
    values
  };
}
