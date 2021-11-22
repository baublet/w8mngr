import React from "react";
import cx from "classnames";
import { Link, useLocation } from "react-router-dom";

interface NavigationIconProps {
  to: string;
  icon: React.ReactComponentElement<any>;
  text: string;
}

export function NavigationIcon(props: NavigationIconProps) {
  const location = useLocation();
  const { to, icon, text } = props;
  const active = location.pathname == to;
  return (
    <Link
      to={to}
      className={cx(
        "block border-b-4 border-transparent opacity-50 hover:opacity-75 h-24 w-24 p-8 hover:bg-green-600 hover:text-white",
        { "rounded-full": !active, "opacity-100 rounded border-purple-100 pointer-events-none": active }
      )}
    >
      <div className="flex flex-col justify-center items-center">
        <div className="text-2xl block mb-2">{icon}</div>
        <span>{text}</span>
      </div>
    </Link>
  );
}
