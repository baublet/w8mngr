import * as React from "react";
import { Link } from "react-router-dom";

export default function BaseButton(props: any): any {
  return props.to ? (
    <Link {...props} className={`inline-block ${props.className}`} />
  ) : (
    <button {...props} className={`inline-block ${props.className}`} />
  );
}
