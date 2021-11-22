import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

interface NavigationIconProps {
  to: string;
  icon: React.ReactComponentElement<any>;
  text: string;
}

export function NavigationIcon(props: NavigationIconProps) {
  const { to, icon, text } = props;
  const active = window.location.pathname == to;
  return (
    <Link
      to={to}
      className={cx(
        "rounded-lg flex flex-col justify-center items-center p-8 border border-opacity-0 border-gray-600 hover:border-opacity-100",
        { "opacity-75": active }
      )}
    >
      <div className="text-xl block mb-2">{icon}</div>
      <span>{text}</span>
    </Link>
  );
}
