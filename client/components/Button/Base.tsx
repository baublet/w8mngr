import * as React from "react";
import { Link } from "react-router-dom";

export default function BaseButton(props: any): React.ReactElement<any, any> {
  return props.href ? <Link {...props} /> : <button {...props} />;
}
