import * as React from "react";
import { Link, LinkProps } from "react-router-dom";

export default function BaseButton(props: any): any {
  return props.to ? <Link {...props} /> : <button {...props} />;
}
