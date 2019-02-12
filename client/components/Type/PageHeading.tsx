import * as React from "react";

export default function FoodLog(
  props: React.HTMLProps<HTMLInputElement>
): React.ReactComponentElement<any> {
  return <h4 className="mt-8 mb-5">{props.children}</h4>;
}
