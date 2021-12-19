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
        "flex items-center justify-center border-b-4 border-r-4 border-transparent hover:border-emerald-200 opacity-50 hover:opacity-75 h-24 w-24 p-4 hover:bg-emerald-400 hover:text-white",
        { "rounded-lg": !active, "opacity-100 pointer-events-none": active }
      )}
    >
      <div className="flex flex-col justify-center items-center">
        <div className="text-2xl block mb-2">{icon}</div>
        <div>{text}</div>
      </div>
    </Link>
  );
}
