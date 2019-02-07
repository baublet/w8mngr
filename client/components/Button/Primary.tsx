import * as React from "react";
import { ReactComponentElement, ReactChildren } from "react";
import { Link, LinkProps, NavLink } from "react-router-dom";

export default function BaseButton(
  props: React.ButtonHTMLAttributes<object>
): any {
  return <button {...props}>{props.children}</button>;
}
