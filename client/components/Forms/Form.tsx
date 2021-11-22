import React from "react";

interface Props {}

export function Form(props: React.PropsWithChildren<Props>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {props.children}
    </form>
  );
}
