import React from "react";
import { Link } from "wouter";

interface NavigationIconProps {
  to: string;
  icon: React.ReactComponentElement<any>;
  text: string;
}

export function NavigationIcon(props: NavigationIconProps) {
  const { to, icon, text } = props;
  return (
    <Link to={to}>
      <a
        className={`
    flex
    items-center
    justify-center
    border-b-4
    border-r-4
    border-transparent
    text-slate-900
    hover:border-emerald-200
    opacity-75
    hover:opacity-100
    h-24
    w-24
    p-4
    hover:bg-emerald-400
    hover:text-white
    rounded-lg
  `}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="text-2xl block mb-2">{icon}</div>
          <div>{text}</div>
        </div>
      </a>
    </Link>
  );
}
